export interface TracerData {
    tracerId?: string;
    matchingFee: number;
    balance: UserBalance;
    oraclePrice: number;
    fundingRate: number;
    marginRatio: number;
}

export type UserBalance = {
    quote: number; // the accounts deposited funds
    base: number; // the position the user currently has
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
    quoteTokenBalance: number | undefined;
    fundingRate: number | undefined;
    matchingFee: number;
    tracerBaseToken: string;
    oraclePrice: number;
    priceMultiplier: number;
};
