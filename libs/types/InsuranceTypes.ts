import Tracer from '@libs/Tracer';
import { BigNumber } from 'bignumber.js';

/**
 * All insurance pool info
 */
export type InsurancePoolInfo = {
    tracer: Tracer;
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

export interface InsuranceTransaction {
    id: string;
    tracer: Tracer;
    transactionType: string;
    amount: number;
    timestamp: string;
}

export interface InsuranceTransactions {
    insuranceTransactions: InsuranceTransaction[];
    error: any;
    loading: any;
    refetch: any;
}
