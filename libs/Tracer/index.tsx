/**
 * Functions to read and write from tracers (including direct trading)
 */
import Web3 from 'web3';
import tracerAbi from '@tracer-protocol/contracts/abi/contracts/TracerPerpetualSwaps.sol/TracerPerpetualSwaps.json';
import ERC20Abi from '@tracer-protocol/contracts/abi/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import oracleAbi from '@tracer-protocol/contracts/abi/contracts/oracle/Oracle.sol/Oracle.json';
import pricingAbi from '@tracer-protocol/contracts/abi/contracts/Pricing.sol/Pricing.json';

import { Oracle } from '@tracer-protocol/contracts/types/Oracle';
import { Pricing } from '@tracer-protocol/contracts/types/Pricing';
import { ERC20 as Erc20Type } from '@tracer-protocol/contracts/types/ERC20';
import { TracerPerpetualSwaps as TracerType } from '@tracer-protocol/contracts/types/TracerPerpetualSwaps';
import BigNumber from 'bignumber.js';

import { AbiItem } from 'web3-utils';
import { UserBalance } from 'types';
import { checkAllowance } from '../web3/utils';
import PromiEvent from 'web3/promiEvent';
// @ts-ignore
import { TransactionReceipt } from 'web3/types';

export const defaults: Record<string, any> = {
    balances: {
        quote: new BigNumber(0),
        base: new BigNumber(0),
        tokenBalance: new BigNumber(0),
        totalLeveragedValue: 0,
        lastUpdatedGasPrice: 0,
    },
    maxLeverage: new BigNumber(1),
    oraclePrice: new BigNumber(0),
    fairPrice: new BigNumber(0),
    quoteTokenDecimals: new BigNumber(1),
    exposure: new BigNumber(0),
    feeRate: new BigNumber(0),
    fundingRateSensitivity: new BigNumber(0),
    twentyFourHourChange: 0,
};

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
    _oracle: Oracle | undefined;
    _pricing: Pricing | undefined;
    public address: string;
    public marketId: string;
    public baseTicker: string;
    public quoteTicker: string;
    public token: Erc20Type | undefined;
    public liquidationGasCost: number | undefined;
    public quoteTokenDecimals: BigNumber;
    public maxLeverage: BigNumber;
    public fundingRateSensitivity: BigNumber;
    public feeRate: BigNumber;
    public initialised: Promise<boolean>;
    public balances: UserBalance;
    public oraclePrice: BigNumber;
    public fairPrice: BigNumber;
    public twentyFourHourChange: number;
    public insuranceContract: string;
    public insuranceApproved: boolean;
    public tracerApproved: boolean;

    constructor(web3: Web3, address: string, marketId: string) {
        this._instance = new web3.eth.Contract(tracerAbi as unknown as AbiItem, address) as unknown as TracerType;
        this._web3 = web3;
        this.address = address;
        this.marketId = marketId;
        const tickers = marketId.split('/');
        this.baseTicker = tickers[0];
        this.quoteTicker = tickers[1];
        this.feeRate = defaults.feeRate;
        this.quoteTokenDecimals = defaults.priceMultiplier;
        this.fundingRateSensitivity = defaults.fundingRateSensitivity;
        this.twentyFourHourChange = defaults.twentyFourHourChange;
        this.insuranceContract = '';
        this.balances = defaults.balances;
        this.oraclePrice = defaults.oraclePrice;
        this.fairPrice = defaults.fairPrice;
        this.maxLeverage = defaults.maxLeverage;
        this.insuranceApproved = false;
        this.tracerApproved = false;
        this.initialised = this.init(web3);
    }

    /**
     * Initialises the tracer with all of its baby items
     * @param web3 provider to create the contracts
     */
    init: (web3: Web3) => Promise<boolean> = async (web3) => {
        const oracleAddress = await this._instance.methods.gasPriceOracle().call();
        const tokenAddr = this._instance.methods.tracerQuoteToken().call();
        const quoteTokenDecimals = this._instance.methods.quoteTokenDecimals().call();
        const liquidationGasCost = this._instance.methods.LIQUIDATION_GAS_COST().call();
        const maxLeverage = this._instance.methods.maxLeverage().call();
        const fundingRateSensitivity = this._instance.methods.fundingRateSensitivity().call();
        const feeRate = this._instance.methods.feeRate().call();
        const insuranceContract = this._instance.methods.insuranceContract().call();
        const pricingContract = this._instance.methods.pricingContract().call();
        return Promise.all([
            quoteTokenDecimals,
            liquidationGasCost,
            tokenAddr,
            oracleAddress,
            maxLeverage,
            fundingRateSensitivity,
            feeRate,
            insuranceContract,
            pricingContract,
        ])
            .then((res) => {
                const priceMultiplier_ = new BigNumber(res[0]);
                this.quoteTokenDecimals = priceMultiplier_;
                this.liquidationGasCost = parseInt(res[1]);
                this.token = res[2]
                    ? (new web3.eth.Contract(ERC20Abi as AbiItem[], res[2]) as unknown as Erc20Type)
                    : undefined;
                this._oracle = res[3]
                    ? (new web3.eth.Contract(oracleAbi as AbiItem[], res[3]) as unknown as Oracle)
                    : undefined;
                this.maxLeverage = new BigNumber(parseFloat(Web3.utils.fromWei(res[4])));
                this.fundingRateSensitivity = new BigNumber(res[5]).div(priceMultiplier_);
                this.feeRate = new BigNumber(res[6]).div(priceMultiplier_);
                this.insuranceContract = res[7];
                this._pricing = res[8]
                    ? (new web3.eth.Contract(pricingAbi as AbiItem[], res[8]) as unknown as Pricing)
                    : undefined;
                this.updateOraclePrice();
                this.updateFairPrice();
                return true;
            })
            .catch((err) => {
                console.error(err, 'Failed to init tracer');
                return false;
            });
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
    updateUserBalance: (account: string | undefined) => Promise<UserBalance> = async (account) => {
        try {
            if (!account) {
                return Promise.resolve(false);
            }
            await this.initialised;
            // if accounts is undefined the catch should get it
            const balance = await this._instance.methods.getBalance(account).call();
            const walletBalance = await this.token?.methods.balanceOf(account).call();
            const parsedBalances = {
                quote: new BigNumber(Web3.utils.fromWei(balance[0][0])),
                base: new BigNumber(Web3.utils.fromWei(balance[0][1])),
                totalLeveragedValue: new BigNumber(Web3.utils.fromWei(balance[1])),
                lastUpdatedGasPrice: new BigNumber(Web3.utils.fromWei(balance[3])),
                tokenBalance: walletBalance
                    ? new BigNumber(walletBalance).div(new BigNumber(10).pow(this.quoteTokenDecimals))
                    : new BigNumber(0),
            };
            console.info(`Fetched user balances: ${JSON.stringify(parsedBalances)}`);
            this.balances = parsedBalances;
            return parsedBalances;
        } catch (error) {
            console.error(`Failed to fetch user balance: ${error}`);
            this.balances = defaults.balances;
            return defaults.balances;
        }
    };

    getBalance: () => UserBalance = () => this.balances;

    updateOraclePrice: () => Promise<void> = async () => {
        try {
            const price = await this._oracle?.methods.latestAnswer().call();
            this.oraclePrice = new BigNumber(Web3.utils.fromWei(price ?? '0'));
        } catch (err) {
            console.error('Failed to fetch oracle price', err);
            this.oraclePrice = new BigNumber(0);
        }
    };

    updateFairPrice: () => Promise<void> = async () => {
        try {
            await this.initialised;
            const fairPrice = await this._pricing?.methods.fairPrice().call();
            this.fairPrice = new BigNumber(Web3.utils.fromWei(fairPrice ?? '0'));
        } catch (err) {
            console.error('Failed to fetch fair price', err);
            this.fairPrice = new BigNumber(0);
        }
    };

    /**
     * A function that returns the funding rate for the market
     */
    updateFeeRate: () => Promise<void> = async () => {
        const feeRate = await this._instance.methods.feeRate().call();
        const set = new BigNumber(Web3.utils.fromWei(feeRate));
        this.feeRate = set;
    };

    /**
     * Deposits into the margin account of the tracer
     * @param amount amount to deposit
     * @param account account depositing
     * @returns web3 PromiEvent type
     */
    // @ts-ignore
    deposit: (amount: number, account: string) => PromiEvent<TransactionReceipt> = (amount, account) => {
        // convert amount to appropriate amount in quote token
        const amount_ = Web3.utils.toWei(amount.toString());
        return this._instance.methods.deposit(amount_).send({ from: account });
    };

    /**
     * Withdraws from the margin account of the tracer
     * @param amount amount to deposit
     * @param account account depositing
     * @returns web3 PromiEvent type
     */
    // @ts-ignore
    withdraw: (amount: number, account: string) => PromiEvent<TransactionReceipt> = (amount, account) => {
        return this._instance.methods.withdraw(Web3.utils.toWei(amount.toString())).send({ from: account });
    };

    /**
     * Checks is an account has approved a contract.
     *  True case is if the approved amount is above 420
     * @param account account to check
     * @returns 0 if not approved 1 if approved and -1 if something went wrong
     */
    checkAllowance: (account: string, contract: string) => Promise<0 | 1 | -1> = async (account, contract) => {
        return checkAllowance(this.token, account, contract);
    };

    /**
     * Approve the tracer token for a given contract address
     * @returns TransactionType event
     */
    // @ts-ignore
    approve: (account: string, contract: string) => PromiEvent<TransactionReceipt> = (account, contract) => {
        const max = Number.MAX_SAFE_INTEGER;
        return this.token?.methods.approve(contract, Web3.utils.toWei(max.toString())).send({ from: account });
    };

    checkApproved: (account: string) => void = async (account) => {
        await this.initialised;
        Promise.all([
            checkAllowance(this.token, account, this.address),
            checkAllowance(this.token, account, this.insuranceContract),
        ]).then((res) => {
            this.tracerApproved = res[0] !== 0;
            this.insuranceApproved = res[0] !== 0;
        });
    };

    getOraclePrice: () => BigNumber = () => {
        return this.oraclePrice;
    };

    getFairPrice: () => BigNumber = () => {
        return this.fairPrice;
    };

    getInsuranceContract: () => string = () => {
        return this.insuranceContract.slice();
    };

    getMaxLeverage: () => BigNumber = () => {
        return this.maxLeverage;
    };

    getFeeRate: () => BigNumber = () => {
        return this.feeRate;
    };

    get24HourChange: () => number = () => {
        return this.twentyFourHourChange;
    };

    getTracerApproved: () => boolean = () => {
        return !!this.tracerApproved;
    };

    getInsuranceApproved: () => boolean = () => {
        return !!this.insuranceApproved;
    };

    setApproved: (address: string) => void = (address) => {
        switch (address) {
            case this.address:
                this.tracerApproved = true;
                return;
            case this.insuranceContract:
                this.insuranceApproved = true;
                return;
            default:
                return;
        }
    };
}
