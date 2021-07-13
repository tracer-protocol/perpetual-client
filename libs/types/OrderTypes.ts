import { BigNumber } from 'bignumber.js';

/**
 * Individual open order
 */
export type OpenOrder = {
    amount: BigNumber;
    price: BigNumber;
    filled: number;
    side: boolean; // true for long, false for short
    maker: string; //address of the order maker
    id: number; // order id
};

/**
 * All open orders
 */
export interface OpenOrders {
    shortOrders: OpenOrder[];
    longOrders: OpenOrder[];
}

/**
 * Type used for the UI order book
 */
export type OMEOrder = {
    // this type is for the ui book
    cumulative: number;
    quantity: number;
    price: number;
    maxCumulative?: number;
};

export interface FilledOrder {
    position: boolean; // true is short, false is long
    amount: BigNumber;
    price: BigNumber;
    timestamp: string;
}

export type LabelledOrders = Record<string, FilledOrder[]>;
