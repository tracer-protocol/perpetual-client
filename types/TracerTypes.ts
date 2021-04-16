export interface TracerData {
    tracerId?: string;
    matchingFee: number;
    balance: UserBalance;
    oraclePrice: number;
    fundingRate: number;
    marginRatio: number;
}

export type UserBalance = {
    base: number; // the accounts deposited base
    quote: number; // the position the user is currently in
    totalLeveragedValue: number;
    lastUpdatedGasPrice: number;
    tokenBalance: number;
};

export type FundingRate = {
    recordTime: number;
    recordPrice: number;
    fundingRate: number;
    fundingRateValue: number;
};

export type TracerInfo = {
    balance: UserBalance | undefined;
    baseTokenBalance: number | undefined;
    fundingRate: number | undefined;
    matchingFee: number;
    tracerBaseToken: string;
    oraclePrice: number;
    priceMultiplier: number;
};
