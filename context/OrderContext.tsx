import React, { useEffect, useContext, useReducer } from 'react';
import { TracerContext, Web3Context } from './';
import { useTracerOrders } from '@hooks/TracerHooks';
import { Children, OpenOrder, OpenOrders, UserBalance } from 'types';
import Tracer from '@libs/Tracer';
import { calcTradeExposure } from '@tracer-protocol/tracer-utils';
import { BigNumber } from 'bignumber.js';

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
        message: 'No deposited balance in TCR market',
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
const checkErrors: (balances: UserBalance | undefined, orders: OpenOrder[], account: string | undefined) => number = (
    balances,
    orders,
    account,
) => {
    if (!account) {
        return 4;
    } else if (orders?.length === 0) {
        // there are no orders
        return 3;
    } else if (!!balances?.base) {
        // user has a position already
        return 0;
    } else if (balances?.tokenBalance.eq(0)) {
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
    rMargin: number; // required margin / amount of margin being used
    leverage: number;
    position: number; // long or short, 0 is short, 1 is long
    price: number; // price of the market asset in relation to the collateral asset
    matchingEngine: number; // for basic this will always be 0 (OME)
    orderType: number; // for basic this will always be 0 (market order), 1 is limit and 2 is spot
    openOrders: OpenOrders;
    exposure: BigNumber;
    error: number; // number ID relating to the error map above
    wallet: number; // ID of corresponding wallet in use 0 -> web3, 1 -> TCR margin
    // boolean to tell if the amount to buy or amount to pay inputs are locked. eg
    //  by changing the amount to pay field it should update the amount to buy and vice versa.
    //  The lock helps avoiding infinite loops when setting these values
    lock: boolean;
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
    | { type: 'setRMargin'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setPosition'; value: number }
    | { type: 'setPrice'; value: number }
    | { type: 'setOrderType'; value: number }
    | { type: 'setMatchingEngine'; value: number }
    | { type: 'setExposure'; value: number }
    | { type: 'setError'; value: number }
    | { type: 'setWallet'; value: number }
    | { type: 'setLock'; value: boolean }
    | { type: 'openOrders'; value: OpenOrders };

// rMargin => require margin
export const OrderStore: React.FC<Children> = ({ children }: Children) => {
    const { setTracerId, tracerId, selectedTracer } = useContext(TracerContext);
    const { updateTrigger, web3, account } = useContext(Web3Context);

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
        rMargin: 0, // required margin / amount of margin being used
        leverage: 0,
        position: 0, // long or short, 0 is short, 1 is long
        price: 0, // price of the market asset in relation to the collateral asset
        matchingEngine: 0, // for basic this will always be 0 (OME)
        orderType: 0, // for basic this will always be 0 (market order), 1 is limit and 2 is spot
        openOrders: {
            shortOrders: [],
            longOrders: [],
        },
        exposure: new BigNumber(0),
        error: -1,
        wallet: 0,
        lock: false, // default lock amount to pay
    };

    const reducer = (state: any, action: OrderAction) => {
        switch (action.type) {
            case 'setMarket':
                return { ...state, market: action.value };
            case 'setCollateral':
                return { ...state, collateral: action.value };
            case 'setRMargin':
                return { ...state, rMargin: action.value };
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
            case 'openOrders':
                return { ...state, openOrders: action.value };
            case 'setExposure':
                return { ...state, exposure: action.value };
            case 'setError':
                return { ...state, error: action.value };
            case 'setWallet':
                return { ...state, wallet: action.value };
            case 'setLock':
                return { ...state, lock: action.value };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [order, orderDispatch] = useReducer(reducer, initialState);

    const openOrders = useTracerOrders(web3, selectedTracer as Tracer);
    const oppositeOrders = order.position ? openOrders.shortOrders : openOrders.longOrders;

    const price_ = 0.5; // TODO replace these with actual price
    useEffect(() => {
        // lock check to avoid loop
        if (order.lock) {
            orderDispatch({ type: 'setExposure', value: order?.rMargin * order.leverage * price_ });
        }
    }, [order.rMargin]);

    useEffect(() => {
        if (!order.lock) {
            orderDispatch({ type: 'setRMargin', value: order?.exposure / price_ / order.leverage });
        }
    }, [order.exposure]);

    useEffect(() => {
        if (order.lock) {
            // locked margin, increase exposure
            orderDispatch({ type: 'setExposure', value: order?.rMargin * order.leverage * price_ });
        } else {
            // locked exposure decrease margin
            orderDispatch({ type: 'setRMargin', value: order?.exposure / price_ / order.leverage });
        }
    }, [order.leverage]);

    // useEffect(() => {
    //     if (oppositeOrders.length) {
    //         orderDispatch({ type: 'setPrice', value: oppositeOrders[0].price.toNumber() });
    //     }
    // }, [oppositeOrders, order.position]);

    const { exposure, tradePrice } = calcTradeExposure(order.rMargin, order.leverage, oppositeOrders);

    // Handles automatically changing the trade price when taking a market order
    useEffect(() => {
        const tradePrice_ = tradePrice.toNumber();
        // the second condition avoids the infinite loop
        if (order.orderType === 0 && order.price !== tradePrice) {
            orderDispatch({ type: 'setPrice', value: tradePrice_ });
        }
    }, [order.orderType]);

    // Handles changing the order type to limit if the user changes the order price
    useEffect(() => {
        const t = tradePrice.toNumber();
        if (order.price !== t) {
            orderDispatch({ type: 'setOrderType', value: 1 });
        } else if (order.price === t && order.orderType === 1) {
            orderDispatch({ type: 'setOrderType', value: 0 });
        }
    }, [order.price]);

    // Resets the trading screen
    const reset = () => {
        // setMarket('TEST0');
        // setCollateral('USD');
        // setRMargin(0);
        // setLeverage(1);
        // setPosition(0);
        // setPrice(0);
        // setMatchingEngine(0);
        // setOrderType(0);
    };

    // Resets the required margin and leverage on an update trigger
    // TODO this is outdated and should probably be removed, not sure of the reprecussions
    useEffect(() => {
        orderDispatch({ type: 'setRMargin', value: 0 });
        orderDispatch({ type: 'setLeverage', value: 1 });
    }, [updateTrigger]);

    // Handles setting the selected tracer Id on a market or collateral change
    useEffect(() => {
        setTracerId ? setTracerId(`${order.market}/${order.collateral}`) : console.error('Error setting tracerId');
    }, [order.market, order.collateral]);

    useEffect(() => {
        const error = checkErrors(selectedTracer?.balances, oppositeOrders, account);
        if (error !== order.error) {
            orderDispatch({ type: 'setError', value: error });
        }
    }, [selectedTracer, oppositeOrders, account]);

    return (
        <OrderContext.Provider
            value={{
                exposure,
                oppositeOrders,
                tradePrice,
                order,
                orderDispatch,
                reset,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
