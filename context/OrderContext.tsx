import React, { useEffect, useContext, useReducer } from 'react';
import { TracerContext, Web3Context } from './';
import { useCalcExposure, useTracerOrders } from '@hooks/TracerHooks';
import { Children, OpenOrder, OpenOrders, TakenOrder } from 'types';
import Tracer from '@libs/Tracer';

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
};

interface ContextProps {
    exposure: number;
    takenOrders: TakenOrder[];
    tradePrice: number;
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
    | { type: 'openOrders'; value: OpenOrders };

// rMargin => require margin
export const OrderStore: React.FC<Children> = ({ children }: Children) => {
    const { setTracerId, tracerId, selectedTracer } = useContext(TracerContext);
    const { updateTrigger, web3 } = useContext(Web3Context);

    useEffect(() => {
        if (tracerId) {
            const id = tracerId.split('/');
            orderDispatch({ type: 'setMarket', value: id[0] });
            orderDispatch({ type: 'setCollateral', value: id[1] });
        }
    }, [tracerId]);

    const initialState: OrderState = {
        market: 'TEST0', // exposed market asset
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
            default:
                throw new Error('Unexpected action');
        }
    };

    const [order, orderDispatch] = useReducer(reducer, initialState);

    const openOrders = useTracerOrders(web3, selectedTracer as Tracer);
    const oppositeOrders = order.position ? openOrders.shortOrders : openOrders.longOrders;

    useEffect(() => {
        if (oppositeOrders.length) {
            orderDispatch({ type: 'setPrice', value: oppositeOrders[0].price });
        }
    }, [oppositeOrders, order.position]);

    // TODO move these out of this context component because these values will have to change
    //  when interacting with the advanced trading screen
    const { exposure, takenOrders, tradePrice } = useCalcExposure(
        order.rMargin,
        order.leverage,
        order.position,
        oppositeOrders,
    );

    // Handles automatically changing the trade price when taking a market order
    useEffect(() => {
        if (order.orderType === 0) {
            orderDispatch({ type: 'setPrice', value: tradePrice });
            orderDispatch({ type: 'setOrderType', value: 0 });
        }
    }, [tradePrice]);

    // Handles changing the order time to limit if the user changes the order price
    useEffect(() => {
        if (order.price !== tradePrice && tradePrice) {
            orderDispatch({ type: 'setOrderType', value: 1 });
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

    return (
        <OrderContext.Provider
            value={{
                exposure,
                takenOrders,
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
