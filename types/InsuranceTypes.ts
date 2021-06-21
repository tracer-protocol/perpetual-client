import { BigNumber } from 'bignumber.js';

export type Holding = {
    rewards: Record<string, unknown>[];
    trader: {
        id: string;
    };
    id: string;
    amount: number;
    timestamp: number;
};

export type InsurancePool = {
    tracer: {
        id: string;
        marketId: string;
    };
    userBalance: number;
    apy: number;
    target: number;
    health: number;
    liquidity: number;
    rewards: number;
    holders: Holding[];
};

export type InsurancePoolInfo = {
    market: string;
    liquidity: BigNumber;
    target: BigNumber;
    userBalance: BigNumber;
    rewards: BigNumber;
    health: BigNumber;
    apy: BigNumber;
    buffer: BigNumber;
    iPoolTokenURL: string;
    iPoolTokenName: string;
};
