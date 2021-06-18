import { BigNumber } from 'bignumber.js';

export type OpenOrder = {
    amount: BigNumber;
    price: BigNumber;
    filled: number;
    side: boolean; // true for long, false for short
    maker: string; //address of the order maker
    id: number; // order id
};

export interface OpenOrders {
    shortOrders: OpenOrder[];
    longOrders: OpenOrder[];
}

export type OMEOrder = {
    // this type is for the ui book
    cumulative: number;
    quantity: number;
    price: number;
    maxCumulative?: number;
};

export type FilledOrder = {
    position: boolean;
    amount: BigNumber;
    price: BigNumber;
    timestamp: string;
};

export type LabelledOrders = Record<string, FilledOrder[]>;
