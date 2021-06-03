import { BigNumber } from 'bignumber.js';

export type TakenOrder = {
    id: number;
    amount: number;
    price: number;
};

type Side = 'Bid' | 'Ask';

export type OrderPayload = {
    address: string; // The Ethereum address of the user
    side: Side; // The side of the market the order is on
    price: number; // The price for the order
    amount: number; // The amount of the order
    expiration: number; // The Unix timestamp at which the order is no longer valid
    signedOrder: string; // Signed order using standard Ethereum message signing
};

export type Order = {
    amount: string;
    price: string;
    side: boolean;
    user: string;
    expiration: number;
    targetTracer: string;
    nonce: 0;
};

export type OrderUpdatePayload = {
    id: string; // The unique identifier of the order to be modified
    address: string; // The Ethereum address of the user
    side: 'bid' | 'ask'; // The side of the market the order is on
    price: number; // The price for the order
    amount: number; // The amount of the order
    expiration: Date; // The Unix timestamp at which the order is no longer valid
    flags: string[]; // order flags
    signedOrder: string; // Signed order using standard Ethereum message signing
};

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
