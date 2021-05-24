/**
 * Functions to read and write from tracers (including direct trading)
 */
import Web3 from 'web3';
import tracerJSON from '@tracer-protocol/contracts/build/contracts/Tracer.json';
import ERC20 from '@tracer-protocol/contracts/build/contracts/ERC20.json';
import accountJSON from '@tracer-protocol/contracts/build/contracts/Account.json';
import oracleJSON from '@tracer-protocol/contracts/build/contracts/Oracle.json';

import { Account as AccountType } from '@tracer-protocol/contracts/types/web3-v1-contracts/Account';
import { Tracer as TracerType } from '@tracer-protocol/contracts/types/web3-v1-contracts/Tracer';
import { Oracle } from '@tracer-protocol/contracts/types/web3-v1-contracts/Oracle';
import { Erc20 as Erc20Type } from '@tracer-protocol/contracts/types/web3-v1-contracts/ERC20';

import { AbiItem } from 'web3-utils';
import { fromCents } from '@libs/utils';
import { checkAllowance } from '@libs/web3/utils';
import { TakenOrder, OpenOrder, Result, UserBalance } from 'types';

/**
 * Tracer class to interact with the tracer contract
 * @private instance - Web3 Tracer contract instance
 * @private web3 - web3 instance
 * @private account - Tracer account instance for this specific tracer
 *  - TODO might be worth abstracting this instance out into its own class,
 *      the only thing with that is if the account instance needs to be interacted with
 *      that much. So is it even worth...
 * @public address - deployed tracer contract address
 * @public token - Web3 ERC20 token instance of the tracers underlying
 */
export default class Tracer {
    _instance: TracerType;
    _web3: Web3;
    public account: AccountType | undefined;
    public accountAddress: string | undefined;
    public address: string;
    public marketId: string;
    _oracle: Oracle | undefined;
    public token: Erc20Type | undefined;
    public liquidationGasCost: number | undefined;
    public priceMultiplier: number | undefined;
    public maxLeverage: number | undefined;
    public fundingRateSensitivity: number | undefined;
    public feeRate: number;
    public initialised: Promise<boolean>;
    public balances: UserBalance;
    public oraclePrice: number;

    constructor(web3: Web3, address: string, marketId: string) {
        this._instance = new web3.eth.Contract(tracerJSON.abi as unknown as AbiItem, address) as unknown as TracerType;
        this._web3 = web3;
        this.address = address;
        this.marketId = marketId;
        this.feeRate = 0;
        this.priceMultiplier = 0;
        this.balances = {
            quote: 0,
            base: 0,
            totalLeveragedValue: 0,
            lastUpdatedGasPrice: 0,
            tokenBalance: 0,
        };
        this.oraclePrice = 0;
        this.initialised = this.init(web3);
    }

    /**
     * Initialises the tracer with all of its baby items
     * @param web3 provider to create the contracts
     */
    init: (web3: Web3) => Promise<boolean> = (web3) => {
        const oracleAddress = this._instance.methods.oracle().call();
        const tokenAddr = this._instance.methods.tracerBaseToken().call();
        const priceMultiplier = this._instance.methods.priceMultiplier().call();
        const liquidationGasCost = this._instance.methods.LIQUIDATION_GAS_COST().call();
        const maxLeverage = this._instance.methods.maxLeverage().call();
        const fundingRateSensitivity = this._instance.methods.FUNDING_RATE_SENSITIVITY().call();
        const feeRate = this._instance.methods.feeRate().call();
        const accountAddress = this._instance.methods.accountContract().call();
        return Promise.all([
            priceMultiplier,
            liquidationGasCost,
            tokenAddr,
            oracleAddress,
            maxLeverage,
            fundingRateSensitivity,
            feeRate,
            accountAddress,
        ])
            .then((res) => {
                const priceMultiplier_ = parseInt(res[0]);
                this.priceMultiplier = priceMultiplier_;
                this.liquidationGasCost = parseInt(res[1]);
                this.token = new web3.eth.Contract(ERC20.abi as AbiItem[], res[2]) as unknown as Erc20Type;
                this._oracle = new web3.eth.Contract(oracleJSON.abi as AbiItem[], res[3]) as unknown as Oracle;
                this.maxLeverage = parseFloat(res[4]) / 10000;
                this.fundingRateSensitivity = parseInt(res[5]) / priceMultiplier_;
                this.feeRate = parseInt(res[6]) / priceMultiplier_;
                this.account = new web3.eth.Contract(accountJSON.abi as AbiItem[], res[7]) as unknown as AccountType;
                this.accountAddress = res[7];
                this.updateOraclePrice();
                return true;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    };

    /**
     * Places an on chain order, fillable by any part on chain.
     * @param amount the amount of Tracers to buy
     * @param price the price in dollars to buy the tracer at
     * @param side the side of the order. True for long, false for short.
     * @param expiration the expiry time for this order
     */
    makeOrder: (amount: number, price: number, side: boolean, from: string) => Promise<Result> = async (
        amount,
        price,
        side,
        from,
    ) => {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);
        try {
            await this._instance.methods
                .makeOrder(
                    Web3.utils.toWei(amount.toString()),
                    price.toString(),
                    side ? true : false,
                    Math.round(expiration.getTime() / 1000).toString(),
                )
                .send({ from: from });
            return { status: 'success', message: 'Successfully created orders' };
        } catch (err) {
            console.error(err);
            return { status: 'error', error: err };
        }
    };

    /**
     * Takes an on chain order, in whole or in part. Order is executed at the makers
     *  defined price.
     * @param orderId the ID of the order to be filled. Emitted in the makeOrder function
     * @param amount the amount of the order to fill.
     */
    takeOrders: (orders: TakenOrder[], from: string) => Promise<Result> = async (orders, from) => {
        try {
            const ARBITRARY_AMOUNT = 420;
            await checkAllowance(this.token, from, this.accountAddress, ARBITRARY_AMOUNT);
            for (const order of orders) {
                await this._instance.methods
                    .takeOrder(order.id, Web3.utils.toWei(order.amount.toString()))
                    .send({ from: from });
            }
            // batching still requires you to confirm multiple times
            // var batch = new this._web3.BatchRequest();
            // for (var order of orders) {
            //     batch.add(
            //         this._instance.methods
            //             .takeOrder(order.id, Web3.utils.toWei(order.amount.toString())).send.request({from: from})
            //     )
            // }
            // await batch.execute();
            return { status: 'success', message: 'Successfully took orders' };
        } catch (err) {
            console.error(err);
            return { status: 'error', error: err };
        }
    };

    /**
     * Gets all open orders placed on chain. First gets the total count of orders and
     * then iterates through the count getting all open orders
     * @return an array of order objects {order amount, amount filled, price and the side of an order, address, id}
     */
    getOpenOrders: () => Promise<Record<string, OpenOrder[]>> = async () => {
        const count = await this._instance.methods.orderCounter().call();
        const shortOrders = [];
        const longOrders = [];
        for (let i = 0; i < parseInt(count); i++) {
            const rawOrder = await this._instance.methods.getOrder(i).call();

            // Amount = filled, not open
            // TODO if the amount not filled is very small this will fail
            const amount = parseFloat(Web3.utils.fromWei(rawOrder[0]));
            const filled = parseFloat(Web3.utils.fromWei(rawOrder[1]));
            if (amount !== filled) {
                const order = {
                    amount: amount,
                    filled: filled,
                    price: fromCents(parseFloat(rawOrder[2])),
                    side: rawOrder[3],
                    maker: rawOrder[4],
                    id: i,
                };
                rawOrder[3] ? longOrders.push(order) : shortOrders.push(order);
            }
        }
        // short orders we want in ascending order since the long wants the lowest priced short
        // opposite for long, the shorts want the highest priced long so put longs in descending
        shortOrders.sort((a, b) => a.price - b.price);
        longOrders.sort((a, b) => b.price - a.price);
        return { shortOrders: shortOrders, longOrders: longOrders };
    };

    /**
     * Gets the users total margin and position balances
     * returns in order
     *  margin, position, totalLeveragedValue,
     *  deposited, lastUpdatedGasPrice, lastUpdatedIndex
     *   int256 quote,
     *   int256 base,
     *   int256 totalLeveragedValue,
     *   int256 lastUpdatedGasPrice,
     *   uint256 lastUpdatedIndex
     */
    updateUserBalance: (account: string | undefined) => Promise<boolean> = async (account) => {
        try {
            if (!this.account) {
                return Promise.resolve(false);
            }
            // if accounts is undefined the catch should get it
            const balance = await this.account.methods.getBalance(account ?? '', this.address.toString()).call();
            const walletBalance = await this.token?.methods.balanceOf(account ?? '').call();
            const parsedBalances = {
                quote: parseFloat(Web3.utils.fromWei(balance[0])),
                base: parseFloat(Web3.utils.fromWei(balance[1])),
                totalLeveragedValue: parseFloat(Web3.utils.fromWei(balance[2])),
                lastUpdatedGasPrice: parseFloat(Web3.utils.fromWei(balance[3])),
                tokenBalance: walletBalance ? parseInt(Web3.utils.fromWei(walletBalance)) : 0,
            };
            console.info(`Fetched user balances: ${parsedBalances}`);
            this.balances = parsedBalances;
            return true;
        } catch (error) {
            console.error(`Failed to fetch user balance: ${error}`);
            this.balances = {
                quote: 0,
                base: 0,
                totalLeveragedValue: 0,
                lastUpdatedGasPrice: 0,
                tokenBalance: 0,
            } as UserBalance;
            return false;
        }
    };

    updateOraclePrice: () => Promise<void> = async () => {
        try {
            const price = await this._oracle?.methods.latestAnswer().call();
            this.oraclePrice = parseFloat(price ?? '0');
        } catch (err) {
            console.error('Failed to fetch oracle price', err);
            this.oraclePrice = 0;
        }
    };

    /**
     * Gets the tracers ID ie BTC/USD
     */
    getTracerId: () => Promise<string> = async () => {
        const tracerId = await this._instance.methods.marketId().call();
        return Web3.utils.toUtf8(tracerId);
    };

    /**
     * Get the tracers address ie 0x27d2..
     */
    getAddress: () => string = () => {
        return this.address;
    };

    /**
     * A function that returns the funding rate for the market
     */
    updateFeeRate: () => Promise<void> = async () => {
        const feeRate = await this._instance.methods.feeRate().call();
        const set = parseInt(feeRate) / (this.priceMultiplier ?? 1);
        this.feeRate = set;
    };

    // get market price will just be the best current offer in open orders
    // filter by side (opposite of position)
    // as well as what market they have chosen

    // Graph of prices will be based on getting 24 hour prices
}
