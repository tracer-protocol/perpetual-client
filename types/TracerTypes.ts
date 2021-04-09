export interface TracerData {
    tracerId?: string;
    matchingFee: number;
    balance: UserBalance;
    oraclePrice: number;
    fundingRate: number;
    marginRatio: number;
}

export type UserBalance = {
    margin: number; // the accounts deposited margin
    position: number; // the position the user is currently in
    deposited: number;
    totalLeveragedValue: number;
    lastUpdatedGasPrice: number;
    walletBalance: number;
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

export type Tracer = {
    address: string; // Tracer contract address
    marketId: string; // Tracer ticker
};
