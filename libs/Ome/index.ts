import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { APIResult, Result } from 'libs/types/General';
import Web3 from 'web3';
import { errors, ok } from './messageMap';

/** Book API's */

// url of the OME. NOTE: THIS DOES NOT CHANGE WITH THE NETWORK
// TODO if we want multiple networks with actual trading we'd need multiple OME's
//  or the OME architecture needs to change
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8989';
const omefy: (str: string) => string = (str: string) => str.slice(2).toLowerCase();

/**
 * Gets the orders related to a specific book
 * @param market Tracer market
 * @returns a full list of currently open orders for a given Tracer
 */
export const getOrders: (market: string) => Promise<{
    bids: any;
    asks: any;
    LTP: number;
    market: string;
    crossed: boolean;
    spread: number;
}> = async (market) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res?.message === 'book_not_found') {
                return {};
            }
            console.debug('Fetched all orders', res?.data);
            return res?.data ?? {};
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Gets the orders related to a specific book and user
 * @param market Tracer market
 * @param account target user
 * @returns a list of user orders given a Tracer market
 *  or an empty array if an error is catched
 */
export const getUsersOrders: (market: string, account: string) => Promise<OMEOrder[]> = async (
    market: string,
    account: string,
) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}/${omefy(account)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.data === 'book_not_found') {
                return [];
            } else if (res.status === 404) {
                console.error('Failed to fetch user orders', res);
                return [];
            }
            console.debug('Fetched user orders', res);
            return res?.data ?? [];
        })
        .catch((err) => {
            console.error('Failed to fetch user orders', err);
            return [];
        });
};

/**
 * Creates an order within a market.
 *
 * Returns a unique identifier of the created order
 * @param market the market the order belongs to
 * @param data order data payload. An example of this request
 */
export const createOrder: (market: string, data: OMEOrder) => Promise<APIResult> = async (market, data) => {
    if (!market) {
        return {
            status: 'error',
            message: 'Failed to create order: Market is invalid',
            messageCode: 'book_not_found',
            data: 'Failed to create order: Market is invalid',
        };
    }
    return fetch(`${BASE_URL}/book/${omefy(market)}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            const { message, data } = res;
            console.debug(`Created order: ${message}`);
            if (errors[message]) {
                return {
                    status: 'error',
                    message: `${errors[message]}`,
                    messageCode: message,
                    data: data,
                } as APIResult;
            } else if (ok[message]) {
                return {
                    status: 'success',
                    message: `${ok[message]}`,
                    messageCode: message,
                    data: data,
                } as APIResult;
            } else {
                return {
                    status: 'error',
                    message: `Unhandled error: ${message}`,
                    messageCode: message,
                    data: data,
                } as APIResult;
            }
        })
        .catch((err) => {
            return {
                status: 'error',
                message: `${err}`,
                messageCode: 'error',
                data: err,
            };
        });
};

/**
 * Gets individual order specific information
 * @param market the market the order belongs to
 * @param orderId of the order being updated
 */
export const getOrder: (market: string, orderId: string) => Promise<Response> = async (market, orderId) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}/order/${orderId}`, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Cancels a specific orderId within a market
 * @param market the market the order belongs to
 * @param orderId of the order being updated
 */
export const cancelOrder: (web3: Web3, account: string, market: string, orderId: string) => Promise<Result> = async (
    web3,
    account,
    market,
    orderId,
) => {
    // @ts-ignore
    const signature = await web3.eth.personal.sign(`cancel:${orderId}`, account);
    const data = {
        marketId: market,
        orderId: orderId,
        signature: signature,
    };
    return fetch(`${BASE_URL}/book/${omefy(market)}/order/${omefy(orderId)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            const { message, data } = res;
            console.debug(`Cancelling order: ${message}`);
            if (errors[message]) {
                return {
                    status: 'error',
                    message: `${errors[message]}`,
                    data: data,
                } as APIResult;
            } else if (ok[message]) {
                return {
                    status: 'success',
                    message: `${ok[message]}`,
                    data: data,
                } as APIResult;
            } else {
                return {
                    status: 'error',
                    message: `Unhandled error: ${message}`,
                    data: res.data,
                } as APIResult;
            }
        })
        .catch((err) => {
            console.error('Failed to cancel order', err);
            return {
                status: 'error',
                message: `${err}`,
            } as Result;
        });
};
