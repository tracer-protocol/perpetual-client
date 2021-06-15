import Tracer from '@libs/Tracer';
import { BigNumber } from 'bignumber.js';
export interface TracerData {
    tracerId?: string;
    matchingFee: number;
    balance: UserBalance;
    oraclePrice: number;
    fundingRate: number;
    marginRatio: number;
}

export type UserBalance = {
    quote: BigNumber; // the accounts deposited funds
    base: BigNumber; // the position the user currently has
    totalLeveragedValue: BigNumber;
    lastUpdatedGasPrice: BigNumber;
    tokenBalance: BigNumber;
    leverage: BigNumber; // the users current leverage
};

export type FundingRate = {
    recordTime: number;
    recordPrice: number;
    fundingRate: number;
    fundingRateValue: number;
};

export type TracerInfo = {
    balance: UserBalance | undefined;
    quoteTokenBalance: BigNumber | undefined;
    fundingRate: number | undefined;
    matchingFee: number;
    tracerBaseToken: string;
    oraclePrice: number;
    priceMultiplier: number;
};

export type CandleData = {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}[];

export type LabelledTracers = Record<string, Tracer & { loading: boolean }>;
