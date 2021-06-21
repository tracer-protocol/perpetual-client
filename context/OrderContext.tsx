import React, { useEffect, useContext, useReducer, useMemo } from 'react';
import { TracerContext, Web3Context } from './';
import { Children, OpenOrder, UserBalance } from 'types';
import { calcMinimumMargin, calcTotalMargin, calcTradeExposure } from '@tracer-protocol/tracer-utils';
import { BigNumber } from 'bignumber.js';
import { OMEContext } from './OMEContext';
import { OMEOrder } from 'types/OrderTypes';
import { FlatOrder } from '@tracer-protocol/tracer-utils/dist/Types/accounting';
import { defaults as tracerDefaults } from '@libs/Tracer';
import { ErrorKey } from '@components/General/Error';

// Position types
export const LONG = 0;
export const SHORT = 1;
// Adjust types
export const ADJUST = 0;
export const CLOSE = 1;
// Order types
export const LIMIT = 0;
export const MARKET = 1;

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
    maxLeverage: BigNumber | undefined,
) => ErrorKey = (balances, orders, account, order, maxLeverage) => {
    const priceBN = new BigNumber(order.price);
    const { quote: newQuote, base: newBase } = order.nextPosition;
    if (!account) {
        return 'ACCOUNT_DISCONNECTED';
    } else if (orders?.length === 0 && order.orderType === MARKET) {
        // there are no orders
        return 'NO_ORDERS';
    } else if (!balances?.base.eq(0) && order.orderType === MARKET && !order.advanced) {
        // user has a position already
        return 'NO_POSITION';
    } else if (balances?.tokenBalance.eq(0) && !order.advanced) {
        // ignore if on advanced
        // user has no web3 wallet balance
        return 'NO_WALLET_BALANCE';
    } else if (balances?.quote.eq(0) && order.exposure && order.price) {
        // user has no tcr margin balance
        return 'NO_MARGIN_BALANCE';
    } else if (
        calcTotalMargin(newQuote, newBase, priceBN).lt(
            calcMinimumMargin(newQuote, newBase, priceBN, maxLeverage ?? tracerDefaults.maxLeverage),
        )
    ) {
        return 'INVALID_ORDER';
    } else {
        return 'NO_ERROR';
    }
};

export const OrderTypeMapping: Record<number, string> = {
    0: 'market',
    1: 'limit',
    2: 'spot',
};

export const orderDefaults = {
    order: {
        market: 'Market', // exposed market asset
        collateral: 'USD', // collateral asset
        amountToPay: NaN, // required margin / amount of margin being used
        exposure: NaN,
        leverage: 1, // default to 1x leverage
        position: LONG, // long or short, 1 long, 0 is short
        price: NaN, // price of the market asset in relation to the collateral asset
        orderType: LIMIT, // orderType
        adjustType: ADJUST,
        adjustSummary: {
            exposure: 0,
            leverage: 1,
        },
        nextPosition: {
            quote: new BigNumber(0),
            base: new BigNumber(0),
        },
        oppositeOrders: [],
        error: 'NO_ERROR',
        wallet: 0,
        lockAmountToPay: false, // deprecated with basic trade
        advanced: false,
        slippage: 0,
    },
};

export type OrderState = {
    market: string; // exposed market asset
    collateral: string; // collateral asset
    amountToPay: number; // required margin / amount of margin being used
    exposure: number;
    leverage: number;
    position: number; // long or short, 0 is short, 1 is long
    price: number; // price of the market asset in relation to the collateral asset
    orderType: number; // for basic this will always be 0 (market order), 1 is limit and 2 is spot
    adjustType: number; // selection for adjust order 0 (adjust), 1 (close)
    adjustSummary: {
        // summary for when adjusting position
        exposure: number;
        leverage: number;
    };
    nextPosition: {
        base: BigNumber;
        quote: BigNumber;
    };
    oppositeOrders: FlatOrder[];
    error: ErrorKey; // number ID relating to the error map above
    wallet: number; // ID of corresponding wallet in use 0 -> web3, 1 -> TCR margin
    // boolean to tell if the amount to buy or amount to pay inputs are locked. eg
    //  by changing the amount to pay field it should update the amount to buy and vice versa.
    //  The lock helps avoiding infinite loops when setting these values
    lockAmountToPay: boolean;
    advanced: boolean; // boolean to check if on basic or advanced page
    slippage: number;
};

interface ContextProps {
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
    | { type: 'setExposure'; value: number }
    | { type: 'setMaxExposure' }
    | { type: 'setBestPrice' }
    | { type: 'setMaxClosure' }
    | { type: 'setSlippage'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setPosition'; value: number }
    | {
          type: 'setNextPosition';
          nextPosition: {
              base: BigNumber;
              quote: BigNumber;
          };
      }
    | { type: 'setPrice'; value: number }
    | { type: 'setOrderType'; value: number }
    | { type: 'setAdjustType'; value: number }
    | {
          type: 'setAdjustSummary';
          adjustSummary: {
              exposure: number;
              leverage: number;
          };
      }
    | { type: 'setError'; value: ErrorKey }
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

    const initialState: OrderState = orderDefaults.order;

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
            case 'setAdjustType':
                return { ...state, adjustType: action.value };
            case 'setAdjustSummary': {
                return { ...state, adjustSummary: action.adjustSummary };
            }
            case 'setOppositeOrders':
                return { ...state, oppositeOrders: action.orders };
            case 'setMarketPrice':
                return { ...state, marketPrice: action.value };
            case 'setExposure':
                return { ...state, exposure: action.value };
            case 'setNextPosition':
                return { ...state, nextPosition: action.nextPosition };
            case 'setMaxExposure':
                const exposure = 1;
                return { ...state, exposure: exposure };
            case 'setMaxClosure':
                const fullClosure = selectedTracer?.getBalance().base.abs();
                return { ...state, exposure: fullClosure };
            case 'setBestPrice':
                const price = state.position === LONG ? omeState?.lowestBid : omeState?.highestAsk;
                if (!price) {
                    // if there is no price set error to no open orders
                    return { ...state, error: "NO_ORDERS"};
                } else {
                    return { ...state, price: price };
                }
            case 'setSlippage':
                return { ...state, slippage: action.value };
            case 'setError':
                return { ...state, error: action.value };
            case 'setWallet':
                return { ...state, wallet: action.value };
            case 'setLock':
                return { ...state, lock: action.value };
            case 'setAdvanced':
                return { ...state, advanced: action.value };
            default:
                throw new Error(`Unexpected action`);
        }
    };

    const [order, orderDispatch] = useReducer(reducer, initialState);

    useMemo(() => {
        if (omeState?.orders) {
            const oppositeOrders = (
                order.position === LONG ? omeState.orders.askOrders : omeState.orders.bidOrders
            ).map((order) => ({
                price: new BigNumber(order.price),
                amount: new BigNumber(order.quantity),
            }));
            orderDispatch({ type: 'setOppositeOrders', orders: oppositeOrders });
            if (order.orderType === MARKET) {
                // market order set the price if on market order
                orderDispatch({
                    type: 'setPrice',
                    value: order.position === LONG ? omeState.lowestBid : omeState.highestAsk,
                });
            }
        }
    }, [order.position, omeState?.orders]);

    useMemo(() => {
        if (order.orderType === MARKET) {
            orderDispatch({ type: 'setBestPrice' });
        } else {
            orderDispatch({ type: 'setPrice', value: NaN });
        }
    }, [order.position, order.orderType]);

    useMemo(() => {
        // when user swaps to close order, set opposite side
        // set the amount to the users position
        if (order.adjustType === CLOSE) {
            const balances = selectedTracer?.getBalance() ?? tracerDefaults.balances;
            if (balances?.base.toNumber() < 0) {
                orderDispatch({ type: 'setPosition', value: LONG });
            } else if (balances?.base > 0) {
                orderDispatch({ type: 'setPosition', value: SHORT });
            }
            orderDispatch({ type: 'setExposure', value: balances.base.abs() });
        }
    }, [order.adjustType]);

    useEffect(() => {
        // calculate the exposure based on the opposite orders
        if (order.orderType === MARKET && order.oppositeOrders.length) {
            // convert orders
            const { slippage } = calcTradeExposure(
                new BigNumber(order.amountToPay ?? 0),
                order.leverage,
                order.oppositeOrders,
            );
            if (!slippage.eq(0)) {
                orderDispatch({ type: 'setSlippage', value: slippage.toNumber() });
            }
        }
    }, [order.amountToPay, order.leverage, order.oppositeOrders]);

    // Resets the trading screen
    const reset = () => {
        console.error('Reset is not implemented ');
    };

    // Handles setting the selected tracer Id on a market or collateral change
    useEffect(() => {
        setTracerId ? setTracerId(`${order.market}/${order.collateral}`) : console.error('Error setting tracerId');
    }, [order.market, order.collateral]);

    useEffect(() => {
        const balances = selectedTracer?.getBalance();
        const totalExposure = order.exposure * order.leverage;
        let newBase = balances?.base.plus(totalExposure) ?? tracerDefaults.balances.base; // add how much exposure you get
        let newQuote = balances?.quote.minus(totalExposure * order.price) ?? tracerDefaults.balances.quote; // subtract how much it costs
        if (order.position === SHORT) {
            newBase = balances?.base.minus(totalExposure) ?? tracerDefaults.balances.base; // add how much exposure you get
            newQuote = balances?.quote.plus(totalExposure * order.price) ?? tracerDefaults.balances.quote; // subtract how much it costs
        }
        orderDispatch({
            type: 'setNextPosition',
            nextPosition: {
                base: newBase,
                quote: newQuote,
            },
        });
    }, [order.exposure, order.price]);

    // Check errors
    useMemo(() => {
        if (omeState?.orders) {
            const oppositeOrders = order.position === LONG ? omeState.orders.askOrders : omeState.orders.bidOrders;
            const error = checkErrors(
                selectedTracer?.getBalance(),
                oppositeOrders,
                account,
                order,
                selectedTracer?.getMaxLeverage(),
            );
            if (error !== order.error) {
                orderDispatch({ type: 'setError', value: error });
            }
        }
    }, [
        // listens to a lot, but not all
        selectedTracer?.getBalance(),
        account,
        order.orders,
        order.orderType,
        order.nextPosition,
    ]);

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
