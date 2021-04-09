import { Pricing as PricingType } from '@tracer-protocol/contracts/types/web3-v1-contracts/Pricing';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { FundingRate } from 'types';

import pricingJSON from '@tracer-protocol/contracts/build/contracts/Pricing.json';
const pricingAddress = process.env.NEXT_PUBLIC_PRICING_ADDRESS;

/**
 * Interface class to interact with the pricing contract
 */
export default class Pricing {
    _instance: PricingType;
    constructor(web3: Web3) {
        this._instance = (new web3.eth.Contract(
            (pricingJSON.abi as unknown) as AbiItem,
            pricingAddress,
        ) as unknown) as PricingType;
    }

    /**
     * Gets the current funding rate for a given tracer address
     * @param market
     * @returns an object containing { recordTime, recordPrice, fundingRate, fundingRateValue }
     */
    getFundingRate: (market: string) => Promise<FundingRate> = async (market) => {
        const fundingIndex = await this._instance.methods.currentFundingIndex(market).call();
        const fundingRate = await this._instance.methods.getFundingRate(market, fundingIndex).call();
        return {
            recordTime: parseInt(Web3.utils.fromWei(fundingRate[0])),
            recordPrice: parseInt(Web3.utils.fromWei(fundingRate[1])),
            fundingRate: parseInt(Web3.utils.fromWei(fundingRate[2])),
            fundingRateValue: parseInt(Web3.utils.fromWei(fundingRate[3])),
        } as FundingRate;
    };

    /**
     * Gets the current insurance funding rate for a given tracer address
     * @param market tracer address
     * @returns an object containing { recordTime, recordPrice, fundingRate, fundingRateValue }
     */
    getInsuranceFundingRate: (market: string) => Promise<FundingRate> = async (market) => {
        const fundingIndex = await this._instance.methods.currentFundingIndex(market).call();
        const fundingRate = await this._instance.methods.getInsuranceFundingRate(market, fundingIndex).call();
        return {
            recordTime: parseInt(Web3.utils.fromWei(fundingRate[0])),
            recordPrice: parseInt(Web3.utils.fromWei(fundingRate[1])),
            fundingRate: parseInt(Web3.utils.fromWei(fundingRate[2])),
            fundingRateValue: parseInt(Web3.utils.fromWei(fundingRate[3])),
        } as FundingRate;
    };

    /** Get 24 hour prices for a given tracer */
    get24HourPrices: (market: string) => Promise<string> = async (market) => {
        try {
            return await this._instance.methods.get24HourPrices(market).call();
        } catch (err) {
            return err;
        }
    };
}
