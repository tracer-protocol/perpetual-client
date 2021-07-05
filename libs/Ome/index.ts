import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { Result } from 'types/General';

const BASE_URL = process.env.NEXT_PUBLIC_OME_BASE_URL ?? 'http://localhost:8989';

/** Book API's */

/**
 * Gets the orders related to a specific book
 */
export const getOrders: (market: string) => Promise<Response> = async (market) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
        });
};

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
            if (res.status === 404) {
                console.error('Failed to fetch user orders', res);
                return [];
            }
            return res;
        })
        .catch((err) => {
            console.error('Failed to fetch user orders', err);
            return [];
        });
};

const omefy: (str: string) => string = (str: string) => str.slice(2).toLowerCase();

/**
 * Creates an order within a market.
 *
 * Returns a unique identifier of the created order
 * @param market the market the order belongs to
 * @param data order data payload. An example of this request
 */
export const createOrder: (market: string, data: OMEOrder) => Promise<Result> = async (market, data) => {
    if (!market) {
        return {
            status: 'error',
            message: 'Failed to create order: Market is invalid',
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
            if (res?.status === 404) {
                return {
                    status: 'error',
                    message: `Failed to create order 404 not found`,
                } as Result;
            } else if (res?.status === 400) {
                return {
                    status: 'error',
                    message: `Failed to create order 400 bad request`,
                } as Result;
            } else {
                return {
                    status: 'success',
                    message: res?.message,
                } as Result;
            }
        })
        .catch((err) => {
            return {
                status: 'error',
                message: `${err}`,
            } as Result;
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
export const cancelOrder: (market: string, orderId: string) => Promise<Result> = async (market, orderId) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}/order/${omefy(orderId)}`, {
        method: 'DELETE',
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            console.info('Successfully cancelled order', res);
            if (res?.status === 404) {
                return {
                    status: 'error',
                    message: `Failed to delete order 404 not found`,
                } as Result;
            } else if (res?.status === 400) {
                return {
                    status: 'error',
                    message: `Failed to delete order 400 bad request`,
                } as Result;
            } else {
                return {
                    status: 'success',
                    message: `${res?.message}: ${orderId}`,
                } as Result;
            }
        })
        .catch((err) => {
            console.error(err);
            return {
                status: 'error',
                message: `Failed to cancel order: ${err}`,
            } as Result;
        });
};
