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
import {
    MatchedOrders,
    TracerPerpetualSwaps as TracerType,
} from '@tracer-protocol/contracts/types/TracerPerpetualSwaps';
import BigNumber from 'bignumber.js';

import { AbiItem } from 'web3-utils';
import { UserBalance } from 'libs/types';
import { checkAllowance } from '../web3/utils';
import PromiEvent from 'web3/promiEvent';
// @ts-ignore
import { TransactionReceipt } from 'web3/types';
import {
    calcAvailableMarginPercent,
    calcLeverage,
    calcMinimumMargin,
    calcTotalMargin,
} from '@tracer-protocol/tracer-utils';
// @ts-ignore
import { Callback } from 'web3/types';
import Insurance from './Insurance';

// Default values
export const defaults: Record<string, any> = {
    balances: {
        quote: new BigNumber(0),
        base: new BigNumber(0),
        tokenBalance: new BigNumber(0),
        totalLeveragedValue: 0,
        lastUpdatedGasPrice: 0,
        leverage: new BigNumber(0),
        totalMargin: new BigNumber(0),
        minimumMargin: new BigNumber(0),
        availableMarginPercent: new BigNumber(0),
    },
    leveragedNotionalValue: new BigNumber(0),
    maxLeverage: new BigNumber(25),
    oraclePrice: new BigNumber(0),
    fairPrice: new BigNumber(0),
    quoteTokenDecimals: new BigNumber(1),
    exposure: new BigNumber(0),
    feeRate: new BigNumber(0),
    defaultFundingRate: new BigNumber(0),
    fundingRateSensitivity: new BigNumber(0),
    twentyFourHourChange: 0,
    baseTicker: '',
    quoteTicker: '',
};

/**
 * Tracer class instance to handle fetching and setting of smart contract data.
 * Works in conjunction with the contexts to update the UI.
 * This class contains all the Tracer information, the contexts will trigger updates and respond
 *  accordingly.
 */
export default class Tracer {
    _instance: TracerType; // contract instance
    _web3: Web3; // web3 instance initialised with
    _gasOracle: Oracle | undefined; // gasOracle contract instance
    _oracle: Oracle | undefined; // price oracle contract instance
    _pricing: Pricing | undefined; // pricing contract instance
    public token: Erc20Type | undefined; // quote token contract instance
    public insuranceContract: Insurance | undefined; // insuranceContract instance
    public address: string; // Tracer address
    public marketId: string; // market ticket in the form of ETH/USDC
    public baseTicker: string; // base ticker eg ETH from ETH/USDC
    public quoteTicker: string; // quote ticker eg USDC from ETH/USDC
    public quoteTokenDecimals: BigNumber; // number of token decimals
    public liquidationGasCost: number | undefined;
    public maxLeverage: BigNumber; // tracers max leverage
    public fundingRateSensitivity: BigNumber; // rate at which the funding rate changes
    public feeRate: BigNumber; // fees paid per trade
    public leveragedNotionalValue: BigNumber; // total value held in the Tracer
    public fundingRate: BigNumber; // current funding rate
    public insuranceFundingRate: BigNumber; // current insurance funding rate
    public balances: UserBalance; // user balances for this Tracer
    public oraclePrice: BigNumber; // current oracle price
    public fairPrice: BigNumber; // current fair price
    public twentyFourHourChange: number; // 24 hour market change in price
    public insuranceApproved: boolean; // boolean representing if a given user has approved the Insurance contract to spend
    public tracerApproved: boolean; // boolean representing if a given user has approved the Tracer contract to spend
    public hasSubscribed: boolean; // boolean representing if this Tracer class has subscribed to contract events
    public initialised: Promise<boolean>; // variable to tell if this Tracer class has been initialised

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
        this.balances = defaults.balances;
        this.oraclePrice = defaults.oraclePrice;
        this.fairPrice = defaults.fairPrice;
        this.maxLeverage = defaults.maxLeverage;
        this.fundingRate = defaults.defaultFundingRate;
        this.insuranceFundingRate = defaults.defaultFundingRate;
        this.leveragedNotionalValue = defaults.leveragedNotionalValue;
        this.insuranceApproved = false;
        this.tracerApproved = false;
        this.initialised = this.init(web3);
        this.hasSubscribed = false;
    }

    /**
     * Initialises the tracer with all of its baby items
     * @param web3 provider to create the contracts
     */
    init: (web3: Web3) => Promise<boolean> = (web3) => {
        const oracleAddress = this._instance.methods.gasPriceOracle().call();
        const tokenAddr = this._instance.methods.tracerQuoteToken().call();
        const quoteTokenDecimals = this._instance.methods.quoteTokenDecimals().call();
        const liquidationGasCost = this._instance.methods.liquidationGasCost().call();
        const maxLeverage = this._instance.methods.trueMaxLeverage().call();
        const fundingRateSensitivity = this._instance.methods.fundingRateSensitivity().call();
        const leveragedNotionalValue = this._instance.methods.leveragedNotionalValue().call();
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
            leveragedNotionalValue,
        ])
            .then((res) => {
                const priceMultiplier_ = new BigNumber(res[0]);
                this.quoteTokenDecimals = priceMultiplier_;
                this.liquidationGasCost = parseInt(res[1]);
                this.token = res[2]
                    ? (new web3.eth.Contract(ERC20Abi as AbiItem[], res[2]) as unknown as Erc20Type)
                    : undefined;
                this._gasOracle = res[3]
                    ? (new web3.eth.Contract(oracleAbi as AbiItem[], res[3]) as unknown as Oracle)
                    : undefined;
                this.maxLeverage = new BigNumber(parseFloat(Web3.utils.fromWei(res[4])));
                this.fundingRateSensitivity = new BigNumber(res[5]).div(priceMultiplier_);
                this.feeRate = new BigNumber(res[6]).div(priceMultiplier_);
                this.leveragedNotionalValue = new BigNumber(Web3.utils.fromWei(res[9]));
                this.insuranceContract = new Insurance(web3, res[7], this.marketId);
                this._pricing = res[8]
                    ? (new web3.eth.Contract(pricingAbi as AbiItem[], res[8]) as unknown as Pricing)
                    : undefined;

                this._pricing?.methods
                    .oracle()
                    .call()
                    .then((oracleAddress) => {
                        this._oracle = oracleAddress
                            ? (new web3.eth.Contract(oracleAbi as AbiItem[], oracleAddress) as unknown as Oracle)
                            : undefined;
                        this.updateOraclePrice();
                    });
                this.updateFairPrice();
                this.updateFundingRates();
                return true;
            })
            .catch((err) => {
                console.error(err, 'Failed to init tracer');
                return false;
            });
    };

    /**
     * Sets a subscription on the matchedOrders event for this Tracer instance
     * @param callback function to be called when the event is triggered
     */
    subscribeToMatchedOrders: (callback: Callback<MatchedOrders>) => void = (callback) => {
        this._instance.events.MatchedOrders(callback);
    };

    /**
     * Sets a subscription on the failedOrders event for this Tracer instance
     * @param callback function to be called when the event is triggered
     */
    subscribeToFailedOrders: (callback: Callback<MatchedOrders>) => void = (callback) => {
        this._instance.events.FailedOrders(callback);
    };

    /**
     * Sets the subscribed variable
     */
    setSubscribed: (val: boolean) => void = (val) => {
        this.hasSubscribed = val;
    };

    /**
     * Updates the user balances for a given tracer.
     * Fetches the Tracer balance as well as the quoteTocken balance.
     * Sets the balances public var as well as returns the balances
     * @param account target user
     * @returns the balances for the given user
     */
    updateUserBalance: (account: string | undefined) => Promise<UserBalance> = async (account) => {
        try {
            if (!account) {
                this.balances = defaults.balances;
                return defaults.balances;
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
            const { quote, base } = parsedBalances;
            const leverage = calcLeverage(quote, base, this.fairPrice);
            const totalMargin = calcTotalMargin(quote, base, this.fairPrice);
            const minimumMargin = calcMinimumMargin(quote, base, this.fairPrice, this.maxLeverage);
            const availableMarginPercent = calcAvailableMarginPercent(quote, base, this.fairPrice, this.maxLeverage);
            console.info(`Fetched user balances: ${JSON.stringify(parsedBalances)}`);
            this.balances = {
                ...parsedBalances,
                leverage: !leverage.eq(0) && leverage ? leverage : defaults.balances.leverage,
                totalMargin: !totalMargin.eq(0) && totalMargin.toNumber() ? totalMargin : defaults.balances.totalMargin,
                minimumMargin:
                    !minimumMargin.eq(0) && minimumMargin.toNumber() ? minimumMargin : defaults.balances.minimumMargin,
                availableMarginPercent:
                    !availableMarginPercent.eq(0) && availableMarginPercent.toNumber()
                        ? availableMarginPercent
                        : defaults.balances.availableMarginPercent,
            };
            return parsedBalances;
        } catch (error) {
            console.error(`Failed to fetch user balance: ${error}`);
            this.balances = defaults.balances;
            return defaults.balances;
        }
    };

    /** Updates this Tracers oraclePrice */
    updateOraclePrice: () => Promise<void> = async () => {
        try {
            const price = await this._oracle?.methods.latestAnswer().call();
            this.oraclePrice = new BigNumber(Web3.utils.fromWei(price ?? '0'));
        } catch (err) {
            console.error('Failed to fetch oracle price', err);
            this.oraclePrice = defaults.oraclePrice;
        }
    };

    /** Updates this Tracers fairPrice */
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
     * Updates the fee rate
     */
    updateFeeRate: () => Promise<void> = async () => {
        const feeRate = await this._instance.methods.feeRate().call();
        const set = new BigNumber(Web3.utils.fromWei(feeRate ?? '0'));
        this.feeRate = set;
    };

    /**
     * Updates both the insurance funding rate and the tracer funding rate
     */
    updateFundingRates: () => Promise<void> = async () => {
        try {
            // fair price is needed. This avoids it being not set when this method is called.
            // this could probably be optimised
            const fairPrice_ = await this._pricing?.methods.fairPrice().call();
            const fairPrice = new BigNumber(Web3.utils.fromWei(fairPrice_ ?? '0'));
            this.fairPrice = fairPrice;
            const currentFundingIndex_ = await this._pricing?.methods.currentFundingIndex().call();
            if (currentFundingIndex_) {
                const currentFundingIndex = parseFloat(currentFundingIndex_);
                const fundingRates = await this._pricing?.methods.fundingRates(currentFundingIndex - 1).call();
                const insuranceFundingRates = await this._pricing?.methods
                    .insuranceFundingRates(currentFundingIndex - 1)
                    .call();
                const fundingRate = new BigNumber(Web3.utils.fromWei(fundingRates?.fundingRate.toString() ?? '0'));
                const insuranceFundingRate = new BigNumber(
                    Web3.utils.fromWei(insuranceFundingRates?.fundingRate.toString() ?? '0'),
                );
                const oneHundred = new BigNumber(100);
                this.fundingRate = fundingRate.div(fairPrice).multipliedBy(oneHundred);
                this.insuranceFundingRate = insuranceFundingRate;
            } else {
                console.error('Failed to update funding rate: Current funding index is 0');
            }
        } catch (err) {
            console.error('Failed to fetch funding rate', err);
            this.fundingRate = defaults.defaultFundingRate;
            this.insuranceFundingRate = defaults.defaultFundingRate;
        }
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
        // insuranceContract should not be false after waiting on initialised
        Promise.all([
            checkAllowance(this.token, account, this.address),
            checkAllowance(this.token, account, this.insuranceContract?.address),
        ]).then((res) => {
            this.tracerApproved = res[0] !== 0;
            this.insuranceApproved = res[1] !== 0;
        });
    };

    // getters
    getBalance: () => UserBalance = () => this.balances;

    getOraclePrice: () => BigNumber = () => {
        return this.oraclePrice;
    };

    getFairPrice: () => BigNumber = () => {
        return this.fairPrice;
    };

    getInsuranceContractAddress: () => string = () => {
        return this.insuranceContract?.address?.slice() ?? '';
    };

    getInsuranceContract: () => Insurance | undefined = () => {
        return this.insuranceContract;
    };

    getLeveragedNotionalValue: () => BigNumber = () => {
        return this.leveragedNotionalValue;
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
        return this.tracerApproved;
    };

    getInsuranceApproved: () => boolean = () => {
        return this.insuranceApproved;
    };

    setApproved: (address: string) => void = (address) => {
        switch (address) {
            case this.address:
                this.tracerApproved = true;
                return;
            case this.insuranceContract?.address:
                this.insuranceApproved = true;
                return;
            default:
                return;
        }
    };

    getFundingRate: () => BigNumber = () => {
        return this.fundingRate;
    };

    getInsuranceFundingRate: () => BigNumber = () => {
        return this.insuranceFundingRate;
    };
}
