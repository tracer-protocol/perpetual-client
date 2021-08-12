import React, { useEffect, useContext, useReducer, useMemo } from 'react';
import { TracerContext } from './';
import { Children, OpenOrder, UserBalance } from 'libs/types';
import { calcMinimumMargin, calcTotalMargin, calcSlippage } from '@tracer-protocol/tracer-utils';
import { BigNumber } from 'bignumber.js';
import { OMEContext } from './OMEContext';
import { ADJUST, CLOSE, LIMIT, LONG, MARKET, OMEOrder, OrderType, Position, SHORT } from 'libs/types/OrderTypes';
import { FlatOrder } from '@tracer-protocol/tracer-utils/dist/Types/accounting';
import { defaults as tracerDefaults } from '@libs/Tracer';
import { ErrorKey } from '@components/General/Error';
import { useWeb3 } from '@context/Web3Context/Web3Context';

/**
 * Returns the Error ID relating to the mapping above
 * These do not need to be in numeric order. It doesnt really matter.
 * @param balances user balances
 * @param orders current orders
 * @param account user account
 * @param order current order state
 * @param fairPrice current fairPrice
 * @param maxLeverage tracer max leverage
 * @returns ErrorKey used to map to an error message
 */
const checkErrors: (
    balances: UserBalance | undefined,
    orders: OMEOrder[],
    account: string | undefined,
    order: OrderState,
    fairPrice: BigNumber | undefined,
    maxLeverage: BigNumber | undefined,
) => ErrorKey = (balances, orders, account, order, fairPrice, maxLeverage) => {
    const priceBN =
        order.orderType === LIMIT ? new BigNumber(order.price) : order.marketTradePrice ?? tracerDefaults.fairPrice;
    const { quote: newQuote, base: newBase } = calcNewBalance(
        order.exposureBN,
        priceBN,
        order.position,
        balances ?? tracerDefaults.balances,
    );
    if (!account) {
        return 'ACCOUNT_DISCONNECTED';
    } else if (orders?.length === 0 && order.orderType === MARKET && order.exposure) {
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
        calcTotalMargin(newQuote, newBase, fairPrice ?? tracerDefaults.fairPrice).lt(
            calcMinimumMargin(
                newQuote,
                newBase,
                fairPrice ?? tracerDefaults.fairPrice,
                maxLeverage ?? tracerDefaults.maxLeverage,
            ),
        )
    ) {
        return 'INVALID_ORDER';
    } else {
        return 'NO_ERROR';
    }
};

// calculates the newQuote and newBase based on a given exposre
const calcNewBalance: (
    addedExposure: BigNumber,
    price: BigNumber,
    position: number,
    balances: UserBalance,
) => { base: BigNumber; quote: BigNumber } = (addedExposure, price, position, balances) => {
    if (position === SHORT) {
        const newBalance = balances?.base.minus(addedExposure) ?? tracerDefaults.balances.base; // subtract how much exposure you get
        const newQuote = balances?.quote.plus(addedExposure.times(price)) ?? tracerDefaults.balances.quote; // add how much it costs
        return {
            base: newBalance,
            quote: newQuote,
        };
    }
    return {
        base: balances?.base.plus(addedExposure) ?? tracerDefaults.balances.base, // add how much exposure you get
        quote: balances?.quote.minus(addedExposure.times(price)) ?? tracerDefaults.balances.quote, // subtract how much it costs
    };
};

export const orderDefaults = {
    order: {
        market: 'Market', // exposed market asset
        collateral: 'USD', // collateral asset
        amountToPay: NaN, // required margin / amount of margin being used
        exposure: NaN,
        // Bignumber representation of exposure. These will not differ as it is set in setExposure
        // Implemented this way to avoid complications with the exposure input and bignumbers
        exposureBN: new BigNumber(0),
        leverage: NaN, // defaults 0 leverage
        position: LONG as Position, // long or short, 1 long, 0 is short
        price: NaN, // price of the market asset in relation to the collateral asset
        orderType: MARKET as OrderType, // orderType
        adjustType: ADJUST,
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
        marketTradePrice: new BigNumber(0),
    },
};

export type OrderState = {
    market: string; // exposed market asset
    collateral: string; // collateral asset
    amountToPay: number; // required margin / amount of margin being used
    exposure: number;
    exposureBN: BigNumber;
    leverage: number; // value used for when adjusting leverage
    position: typeof LONG | typeof SHORT; // long or short, 0 is short, 1 is long
    price: number; // price of the market asset in relation to the collateral asset
    orderType: number; // for basic this will always be 0 (market order), 1 is limit and 2 is spot
    adjustType: number; // selection for adjust order 0 (adjust), 1 (close)
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
    marketTradePrice: BigNumber; // trade price calculated when fetching slippage
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
    | { type: 'setExposureFromLeverage'; leverage: number }
    | {
          type: 'setLeverageFromExposure';
          amount: number;
      }
    | { type: 'setSlippage'; value: number }
    | { type: 'setMarketTradePrice'; value: BigNumber }
    | { type: 'setLeverage'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setPosition'; value: Position }
    | { type: 'setNextPosition' }
    | { type: 'setPrice'; value: number }
    | { type: 'setOrderType'; value: OrderType }
    | { type: 'setAdjustType'; value: number }
    | { type: 'setError'; value: ErrorKey }
    | { type: 'setWallet'; value: number }
    | { type: 'setLock'; value: boolean }
    | { type: 'setAdvanced'; value: boolean }
    | { type: 'setOppositeOrders'; orders: FlatOrder[] };
/**
 * Large context which manages OrderState when interacting with the trading interfaces
 * Leverages useReducer to provide dispatches which modify and update state.
 */
export const OrderStore: React.FC<Children> = ({ children }: Children) => {
    const { account } = useWeb3();
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { omeState } = useContext(OMEContext);

    useEffect(() => {
        if (tracerId) {
            const id = tracerId.split('/');
            orderDispatch({ type: 'setMarket', value: id[0] });
            orderDispatch({ type: 'setCollateral', value: id[1] });
        }
    }, [tracerId]);

    // Resets the trading screen
    const reset = () => {
        console.error('Reset is not implemented ');
    };

    const initialState: OrderState = orderDefaults.order;

    const reducer = (state: any, action: OrderAction) => {
        const { quote, base, leverage } = selectedTracer?.getBalance() ?? tracerDefaults.balances;
        const fairPrice = selectedTracer?.getFairPrice() ?? tracerDefaults.fairPrice;
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
                return {
                    ...state,
                    orderType: action.value,
                };
            case 'setAdjustType':
                const short = base.lt(0);
                const long = base.gt(0);
                if (action.value === CLOSE) {
                    if (short) {
                        return {
                            ...state,
                            adjustType: action.value,
                            position: LONG,
                        };
                    }
                    if (long) {
                        return {
                            ...state,
                            adjustType: action.value,
                            position: SHORT,
                        };
                    }
                }
                return { ...state, adjustType: action.value };
            case 'setExposureFromLeverage': {
                let position;
                // issue here is action.leverage is negative for short values
                // but leverage is always positive no matter if short or long
                if (base.lt(0)) {
                    if (action.leverage > leverage.negated().toNumber()) {
                        // deleverage short bosition
                        position = LONG;
                    } else {
                        position = SHORT;
                    }
                } else if (base.gt(0)) {
                    if (action.leverage < leverage.toNumber()) {
                        // deleverage
                        position = SHORT;
                    } else {
                        position = LONG;
                    }
                } else if (base.eq(0)) {
                    // if base is 0 let leverage determine position
                    position = action.leverage < 0 ? SHORT : action.leverage > 0 ? LONG : state.position;
                } else if (quote.eq(0)) {
                    // if quote is 0 then dont change anything
                    return {
                        ...state,
                        position: action.leverage < 0 ? SHORT : action.leverage > 0 ? LONG : state.position,
                    };
                }
                const targetLeverage = new BigNumber(action.leverage);
                let addedExposure;
                if (targetLeverage.eq(0)) {
                    addedExposure = base.abs();
                } else {
                    // for long
                    // set constant x to simply equation
                    // full working https://www.notion.so/tracerdao/New-position-incorrectly-updating-91d0c68a116b40b3a5d7944421ebc86f
                    const x = fairPrice.div(targetLeverage).minus(fairPrice);
                    addedExposure = quote.minus(base.times(x)).div(x.plus(state.marketTradePrice));

                    // for short
                    if (position === SHORT) {
                        addedExposure = base.times(x).minus(quote).div(state.marketTradePrice.plus(x));
                    }
                }
                return {
                    ...state,
                    exposure: addedExposure.toNumber(),
                    exposureBN: addedExposure,
                    position: position,
                };
            }
            case 'setLeverageFromExposure': {
                if (Number.isNaN(action.amount)) {
                    return {
                        ...state,
                        leverage: base.lt(0) ? leverage * -1 : leverage,
                        exposure: action.amount, // is nan
                        exposureBN: orderDefaults.order.exposureBN,
                    };
                }
                const { base: newBase, quote: newQuote } = calcNewBalance(
                    new BigNumber(action.amount),
                    state.marketTradePrice,
                    state.position,
                    selectedTracer?.getBalance() ?? tracerDefaults.balances,
                );
                const notional = newBase.times(fairPrice);
                const newTotalMargin = calcTotalMargin(newQuote, newBase, fairPrice);
                const targetLeverage = notional.div(newTotalMargin);
                return {
                    ...state,
                    leverage: targetLeverage.toNumber(),
                };
            }
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setOppositeOrders':
                return { ...state, oppositeOrders: action.orders };
            case 'setExposure':
                return { ...state, exposure: action.value, exposureBN: new BigNumber(action.value ?? 0) };
            case 'setNextPosition':
                if (state.orderType === LIMIT) {
                    return {
                        ...state,
                        nextPosition: calcNewBalance(
                            state.exposureBN,
                            new BigNumber(state.price),
                            state.position,
                            selectedTracer?.getBalance() ?? tracerDefaults.balances,
                        ),
                    };
                } else {
                    return {
                        ...state,
                        nextPosition: calcNewBalance(
                            state.exposureBN,
                            state.marketTradePrice,
                            state.position,
                            selectedTracer?.getBalance() ?? tracerDefaults.balances,
                        ),
                    };
                }
            case 'setMaxExposure':
                const exposure = 1;
                return { ...state, exposure: exposure };
            case 'setMaxClosure':
                const fullClosure = selectedTracer?.getBalance().base.abs();
                return { ...state, exposure: fullClosure };
            case 'setBestPrice':
                const price = state.position === LONG ? omeState?.maxAndMins?.minAsk : omeState?.maxAndMins?.maxBid;
                if (!price) {
                    // if there is no price set error to no open orders
                    return { ...state, error: 'NO_ORDERS' };
                } else {
                    return { ...state, price: parseFloat(price.toFixed(2)) };
                }
            case 'setSlippage':
                return { ...state, slippage: action.value };
            case 'setMarketTradePrice':
                return { ...state, marketTradePrice: action.value };
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
        // sets the oppositeOrders based on the users selected position
        // triggered when the users position or the list of orders changes
        if (omeState?.orders) {
            const oppositeOrders = (
                order.position === LONG ? omeState.orders.askOrders : omeState.orders.bidOrders
            ).map((order) => ({
                price: new BigNumber(order.price),
                amount: new BigNumber(order.quantity),
            }));
            orderDispatch({ type: 'setOppositeOrders', orders: oppositeOrders });
            if (order.orderType === MARKET) {
                // market order set the price to the bottom of the book
                orderDispatch({
                    type: 'setPrice',
                    value:
                        (order.position === LONG ? omeState?.maxAndMins?.maxAsk : omeState?.maxAndMins?.minBid) ?? NaN,
                });
            }
        }
    }, [order.position, omeState?.orders]);

    useMemo(() => {
        // Updates the price when orderType changes to market.
        // If it changes to limit then it resets the price
        if (order.orderType === MARKET) {
            orderDispatch({
                type: 'setPrice',
                value: (order.position === LONG ? omeState?.maxAndMins?.maxAsk : omeState?.maxAndMins?.minBid) ?? NaN,
            });
        }
    }, [order.position, order.orderType]);

    useMemo(() => {
        // when user swaps to close order, set opposite side
        // set the amount to the users position
        if (order.adjustType === CLOSE) {
            const balances = selectedTracer?.getBalance() ?? tracerDefaults.balances;
            if (balances?.base.lt(0)) {
                orderDispatch({ type: 'setPosition', value: LONG });
            } else if (balances?.base.gt(0)) {
                orderDispatch({ type: 'setPosition', value: SHORT });
            }
            orderDispatch({ type: 'setExposure', value: balances.base.abs() });
        }
    }, [order.adjustType]);

    useMemo(() => {
        // calculate the exposure based on the opposite orders
        if (order.orderType === MARKET && order.oppositeOrders.length) {
            // convert orders
            const { slippage, tradePrice } = calcSlippage(
                order.exposureBN,
                // TODO remove this, its because we used to factor in leverage per trade ie 2x would double exposure
                new BigNumber(1),
                order.oppositeOrders,
            );
            if (!slippage.eq(0)) {
                orderDispatch({ type: 'setSlippage', value: slippage.toNumber() });
            } else {
                orderDispatch({ type: 'setSlippage', value: 0 });
            }
            if (!tradePrice.eq(0)) {
                orderDispatch({ type: 'setMarketTradePrice', value: tradePrice });
            }
        }
    }, [order.exposure, order.oppositeOrders]);

    useEffect(() => {
        // sets the next position when exposire, price or the users base balance changes
        orderDispatch({
            type: 'setNextPosition',
        });
    }, [order.exposure, order.price, selectedTracer?.getBalance().base]);

    useMemo(() => {
        // sets the leverage when the users account leverage changes
        let leverage = selectedTracer?.getBalance()?.leverage ?? tracerDefaults.balances.leverage;
        if (!leverage?.eq(0) && leverage) {
            const base = selectedTracer?.getBalance().base ?? tracerDefaults.balances.base;
            if (base.lt(0)) {
                leverage = leverage.negated();
            }
            console.info('Setting leverage', leverage.toNumber());
            orderDispatch({
                type: 'setLeverage',
                value: parseFloat(leverage.toNumber().toFixed(2)),
            });
        }
    }, [selectedTracer?.getBalance().leverage]);

    useMemo(() => {
        // Check errors and update the error state if there is an error
        if (omeState?.orders) {
            const oppositeOrders = order.position === LONG ? omeState.orders.askOrders : omeState.orders.bidOrders;
            const error = checkErrors(
                selectedTracer?.getBalance(),
                oppositeOrders,
                account,
                order,
                selectedTracer?.getFairPrice(),
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
