import React, { useEffect, useContext, useReducer, useMemo } from 'react';
import { TracerContext, Web3Context } from './';
import { Children, OpenOrder, UserBalance } from 'types';
import { calcTradeExposure } from '@tracer-protocol/tracer-utils';
import { BigNumber } from 'bignumber.js';
import { OMEContext } from './OMEContext';
import { OMEOrder } from 'types/OrderTypes';
import { FlatOrder } from '@tracer-protocol/tracer-utils/dist/Types/accounting';

calcTradeExposure;
/**
 * -1 is no error
 * 0 is reserved for unknown
 */
export const Errors: Record<number, Error> = {
    0: {
        name: 'User has position',
        message: 'You have an open trade. Switch to',
    },
    1: {
        name: 'No Wallet Balance',
        message: 'No balance found in web3 wallet',
    },
    2: {
        name: 'No Margin Balance',
        message:
            'You have nothing in your margin account. Use your wallet account or deposit to your margin account by switching to',
    },
    3: {
        name: 'No Orders',
        message: 'No open orders for this market',
    },
    4: {
        name: 'Account Disconnected',
        message: 'Please connect your wallet',
    },
    5: {
        name: 'Invalid Funds',
        message: 'You do not have enough funds in your wallet',
    },
};

/**
 * Returns the Error ID relating to the mapping above
 * These do not need to be in numeric order. It doesnt really matter.
 * @param balances
 * @param orders
 * @returns
 */
const checkErrors: (
    balances: UserBalance | undefined,
    orders: OMEOrder[],
    account: string | undefined,
    order: OrderState,
) => number = (balances, orders, account, order) => {
    if (!account) {
        return 4;
    } else if (orders?.length === 0 && order.orderType === 0) {
        // there are no orders
        return 3;
    } else if (!balances?.base.eq(0) && order.orderType === 0) {
        // user has a position already
        return 0;
    } else if (balances?.tokenBalance.eq(0) && !order.advanced) {
        // ignore if on advanced
        // user has no web3 wallet balance
        return 1;
    } else if (balances?.quote.eq(0)) {
        // user has no tcr margin balance
        return 2;
    } else {
        return -1;
    }
};

export const OrderTypeMapping: Record<number, string> = {
    0: 'market',
    1: 'limit',
    2: 'spot',
};

export type OrderState = {
    market: string; // exposed market asset
    collateral: string; // collateral asset
    amountToPay: number; // required margin / amount of margin being used
    amountToBuy: number;
    leverage: number;
    position: number; // long or short, 0 is short, 1 is long
    price: number; // price of the market asset in relation to the collateral asset
    matchingEngine: number; // for basic this will always be 0 (OME)
    orderType: number; // for basic this will always be 0 (market order), 1 is limit and 2 is spot
    oppositeOrders: FlatOrder[];
    error: number; // number ID relating to the error map above
    wallet: number; // ID of corresponding wallet in use 0 -> web3, 1 -> TCR margin
    // boolean to tell if the amount to buy or amount to pay inputs are locked. eg
    //  by changing the amount to pay field it should update the amount to buy and vice versa.
    //  The lock helps avoiding infinite loops when setting these values
    lockAmountToPay: boolean;
    advanced: boolean; // boolean to check if on basic or advanced page
};

interface ContextProps {
    exposure: BigNumber;
    tradePrice: BigNumber;
    oppositeOrders: OpenOrder[];
    order: OrderState;
    orderDispatch: React.Dispatch<OrderAction>;
    reset: () => void;
}

/**
 * This class is used to control the order hooks throughout making a trade
 *
 */
export const OrderContext = React.createContext<Partial<ContextProps>>({});

export type OrderAction =
    | { type: 'setMarket'; value: string }
    | { type: 'setCollateral'; value: string }
    | { type: 'setAmountToPay'; value: number }
    | { type: 'setAmountToBuy'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setPosition'; value: number }
    | { type: 'setPrice'; value: number }
    | { type: 'setOrderType'; value: number }
    | { type: 'setMatchingEngine'; value: number }
    | { type: 'setError'; value: number }
    | { type: 'setWallet'; value: number }
    | { type: 'setLock'; value: boolean }
    | { type: 'setAdvanced'; value: boolean }
    | { type: 'setMarketPrice'; value: number }
    | { type: 'setOppositeOrders'; orders: FlatOrder[] };

// amountToPay => require margin
export const OrderStore: React.FC<Children> = ({ children }: Children) => {
    const { account } = useContext(Web3Context);
    const { setTracerId, tracerId, selectedTracer } = useContext(TracerContext);
    const { omeState } = useContext(OMEContext);

    useEffect(() => {
        if (tracerId) {
            const id = tracerId.split('/');
            orderDispatch({ type: 'setMarket', value: id[0] });
            orderDispatch({ type: 'setCollateral', value: id[1] });
        }
    }, [tracerId]);

    const initialState: OrderState = {
        market: 'Market', // exposed market asset
        collateral: 'USD', // collateral asset
        amountToPay: NaN, // required margin / amount of margin being used
        amountToBuy: NaN,
        leverage: 1, // default to 1x leverage
        position: 0, // long or short, 0 is short, 1 is long
        price: NaN, // price of the market asset in relation to the collateral asset
        matchingEngine: 0, // for basic this will always be 0 (OME)
        orderType: 0, // for basic this will always be 0 (market order), 1 is limit and 2 is spot
        oppositeOrders: [],
        error: -1,
        wallet: 0,
        lockAmountToPay: false, // default lock amount to buy
        advanced: false,
    };

    const reducer = (state: any, action: OrderAction) => {
        switch (action.type) {
            case 'setMarket':
                return { ...state, market: action.value };
            case 'setCollateral':
                return { ...state, collateral: action.value };
            case 'setAmountToPay':
                return { ...state, amountToPay: action.value };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setPosition':
                return { ...state, position: action.value };
            case 'setPrice':
                return { ...state, price: action.value };
            case 'setOrderType':
                return { ...state, orderType: action.value };
            case 'setMatchingEngine':
                return { ...state, matchingEngine: action.value };
            case 'setOppositeOrders':
                return { ...state, oppositeOrders: action.orders };
            case 'setMarketPrice':
                return { ...state, marketPrice: action.value };
            case 'setAmountToBuy':
                return { ...state, amountToBuy: action.value };
            case 'setError':
                return { ...state, error: action.value };
            case 'setWallet':
                return { ...state, wallet: action.value };
            case 'setLock':
                return { ...state, lock: action.value };
            case 'setAdvanced':
                return { ...state, advanced: action.value };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [order, orderDispatch] = useReducer(reducer, initialState);

    useMemo(() => {
        if (omeState?.orders) {
            const oppositeOrders = (order.position ? omeState.orders.askOrders : omeState.orders.bidOrders).map(
                (order) => ({
                    price: new BigNumber(order.price),
                    amount: new BigNumber(order.quantity),
                }),
            );
            orderDispatch({ type: 'setOppositeOrders', orders: oppositeOrders });
            if (order.orderType === 0) {
                // market order
                if (order.advanced && !order.amountToBuy) {
                    return;
                } // dont set if advanced and no amount
                orderDispatch({ type: 'setPrice', value: oppositeOrders[0]?.price?.toNumber() ?? NaN });
            }
        }
    }, [order.position, omeState?.orders]);

    useEffect(() => {
        if (order.orderType === 0) {
            if (!order.lockAmountToPay) {
                // locked amount to buy input so increase amount to buy
                orderDispatch({
                    type: 'setAmountToBuy',
                    value: order?.amountToPay * order.leverage * order.price,
                });
            } else {
                // locked exposure decrease margin
                orderDispatch({
                    type: 'setAmountToPay',
                    value: order?.amountToBuy.toNumber() / order.price / order.leverage,
                });
            }
        }
    }, [order.leverage]);

    useEffect(() => {
        if (order.orderType === 0) {
            orderDispatch({ type: 'setPrice', value: order.oppositeOrders[0]?.price?.toNumber() ?? NaN });
        }
    }, [order.orderType]);

    useEffect(() => {
        // calculate the exposure based on the opposite orders
        if (order.orderType === 0 && order.oppositeOrders.length) {
            // convert orders
            const { exposure, tradePrice } = calcTradeExposure(
                new BigNumber(order.amountToPay ?? 0),
                order.leverage,
                order.oppositeOrders,
            );
            if (!exposure.eq(0)) {
                orderDispatch({ type: 'setAmountToBuy', value: exposure.toNumber() });
            }
            if (!tradePrice.eq(0)) {
                orderDispatch({ type: 'setPrice', value: tradePrice.toNumber() });
            }
        }
    }, [order.amountToPay, order.leverage, order.oppositeOrders]);

    useEffect(() => {
        // calculate and set the exposure based on the orderPrice for limit
        if (order.orderType === 1) {
            orderDispatch({ type: 'setAmountToBuy', value: order.price * order.amountToPay });
        }
    }, [order.amountToPay, order.price, order.orderType]);

    // Resets the trading screen
    const reset = () => {
        // setMarket('TEST0');
        // setCollateral('USD');
        // setAmountToPay(0);
        // setLeverage(1);
        // setPosition(0);
        // setPrice(0);
        // setMatchingEngine(0);
        // setOrderType(0);
    };

    // Resets the required margin and leverage on an update trigger
    // TODO this is outdated and should probably be removed, not sure of the reprecussions
    // useEffect(() => {
    //     orderDispatch({ type: 'setAmountToPay', value: 0 });
    //     orderDispatch({ type: 'setLeverage', value: 1 });
    // }, [updateTrigger]);

    // Handles setting the selected tracer Id on a market or collateral change
    useEffect(() => {
        setTracerId ? setTracerId(`${order.market}/${order.collateral}`) : console.error('Error setting tracerId');
    }, [order.market, order.collateral]);

    useMemo(() => {
        if (omeState?.orders) {
            const oppositeOrders = order.position ? omeState.orders.askOrders : omeState.orders.bidOrders;
            const error = checkErrors(selectedTracer?.balances, oppositeOrders, account, order);
            if (error !== order.error) {
                orderDispatch({ type: 'setError', value: error });
            }
        }
    }, [selectedTracer, account, order]);

    return (
        <OrderContext.Provider
            value={{
                order,
                orderDispatch,
                reset,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
