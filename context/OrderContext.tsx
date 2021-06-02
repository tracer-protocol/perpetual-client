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
    orderBase: number; // required margin / amount of margin being used
    leverage: number;
    position: number; // long or short, 0 is short, 1 is long
    price: number; // price of the market asset in relation to the collateral asset
    matchingEngine: number; // for basic this will always be 0 (OME)
    orderType: number; // for basic this will always be 0 (market order), 1 is limit and 2 is spot
    oppositeOrders: FlatOrder[];
    exposure: BigNumber;
    error: number; // number ID relating to the error map above
    wallet: number; // ID of corresponding wallet in use 0 -> web3, 1 -> TCR margin
    // boolean to tell if the amount to buy or amount to pay inputs are locked. eg
    //  by changing the amount to pay field it should update the amount to buy and vice versa.
    //  The lock helps avoiding infinite loops when setting these values
    lock: boolean;
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
    | { type: 'setOrderBase'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setPosition'; value: number }
    | { type: 'setPrice'; value: number }
    | { type: 'setOrderType'; value: number }
    | { type: 'setMatchingEngine'; value: number }
    | { type: 'setExposure'; value: BigNumber }
    | { type: 'setError'; value: number }
    | { type: 'setWallet'; value: number }
    | { type: 'setLock'; value: boolean }
    | { type: 'setAdvanced'; value: boolean }
    | { type: 'setMarketPrice'; value: number }
    | { type: 'setOppositeOrders'; orders: FlatOrder[] };

// orderBase => require margin
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
        orderBase: 0, // required margin / amount of margin being used
        leverage: 0,
        position: 0, // long or short, 0 is short, 1 is long
        price: NaN, // price of the market asset in relation to the collateral asset
        matchingEngine: 0, // for basic this will always be 0 (OME)
        orderType: 0, // for basic this will always be 0 (market order), 1 is limit and 2 is spot
        oppositeOrders: [],
        exposure: new BigNumber(0),
        error: -1,
        wallet: 0,
        lock: false, // default lock amount to pay
        advanced: false,
    };

    const reducer = (state: any, action: OrderAction) => {
        switch (action.type) {
            case 'setMarket':
                return { ...state, market: action.value };
            case 'setCollateral':
                return { ...state, collateral: action.value };
            case 'setOrderBase':
                return { ...state, orderBase: action.value };
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
            case 'setExposure':
                return { ...state, exposure: action.value };
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

    // only lock when on market order
    useMemo(() => {
        // lock check to avoid loop
        if (order.orderType === 0) {
            console.log("setting order base 2")
            console.log(order.lock)
            if (order.lock) {
                orderDispatch({
                    type: 'setExposure',
                    value: new BigNumber(order?.orderBase * order.leverage * order.marketPrice),
                });
            }
        }
    }, [order.orderBase]);

    useMemo(() => {
        if (order.orderType === 0) {
            console.log("setting order base")
            if (!order.lock) {
                orderDispatch({ type: 'setOrderBase', value: order?.exposure / order.marketPrice / order.leverage });
            }
        }
    }, [order.exposure]);

    useMemo(() => {
        if (omeState?.orders) {
            let oppositeOrders = (order.position ? omeState.orders.askOrders : omeState.orders.bidOrders).map((order) => ({
                price: new BigNumber(order.price),
                amount: new BigNumber(order.quantity)
            }));
            orderDispatch({ type: 'setOppositeOrders', orders: oppositeOrders })
            orderDispatch({ type: 'setMarketPrice', value: oppositeOrders[0]?.price?.toNumber() ?? 0})
        }
    }, [order.position, omeState?.orders])

    useEffect(() => {
        if (order.orderType === 0) {
            if (order.lock) {
                // locked base, increase exposure
                orderDispatch({
                    type: 'setExposure',
                    value: new BigNumber(order?.orderBase * order.leverage * order.marketPrice),
                });
            } else {
                // locked exposure decrease margin
                orderDispatch({ type: 'setOrderBase', value: order?.exposure / order.marketPrice / order.leverage });
            }
        }
    }, [order.leverage]);

    useMemo(() => {
        // calculate the exposure based on the opposite orders
        if (order.orderType === 0 && omeState?.orders) {
            // convert orders
            let tradeQuote = Number.isNaN(order.orderBase) ? new BigNumber(order.orderBase) : new BigNumber(0);
            const { exposure, tradePrice } = calcTradeExposure(
                tradeQuote, order.leverage, order.oppositeOrders
            );
            orderDispatch({ type: 'setExposure', value: exposure });
            if (!!tradePrice.toNumber()) {
                orderDispatch({ type: 'setPrice', value: tradePrice.toNumber() });
            }
        }
    }, [order.orderBase, order.leverage, order.oppositeOrders]);

    useEffect(() => {
        // calculate and set the exposure based on the orderPrice for limit
        if (order.orderType === 1) {
            orderDispatch({ type: 'setExposure', value: new BigNumber(order.price * order.orderBase) });
        }
    }, [order.orderBase, order.price, order.orderType]);

    // Resets the trading screen
    const reset = () => {
        // setMarket('TEST0');
        // setCollateral('USD');
        // setOrderBase(0);
        // setLeverage(1);
        // setPosition(0);
        // setPrice(0);
        // setMatchingEngine(0);
        // setOrderType(0);
    };

    // Resets the required margin and leverage on an update trigger
    // TODO this is outdated and should probably be removed, not sure of the reprecussions
    // useEffect(() => {
    //     orderDispatch({ type: 'setOrderBase', value: 0 });
    //     orderDispatch({ type: 'setLeverage', value: 1 });
    // }, [updateTrigger]);

    // Handles setting the selected tracer Id on a market or collateral change
    useEffect(() => {
        setTracerId ? setTracerId(`${order.market}/${order.collateral}`) : console.error('Error setting tracerId');
    }, [order.market, order.collateral]);

    useMemo(() => {
        if (omeState?.orders) {
            let oppositeOrders = order.position ? omeState.orders.askOrders : omeState.orders.bidOrders
            const error = checkErrors(selectedTracer?.balances, oppositeOrders, account, order);
            if (error !== order.error) {
                orderDispatch({ type: 'setError', value: error });
            }
        }
    }, [selectedTracer, account, order]);

    console.log(order.oppositeOrders, "opposite orders")

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
