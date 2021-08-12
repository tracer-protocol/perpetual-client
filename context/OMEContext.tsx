import { getOrders, getUsersOrders } from '@libs/Ome';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import React, { useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Children } from 'libs/types';
import { TracerContext } from './TracerContext';
import { FilledOrder, OMEOrder as FlattenedOMEOrder } from 'libs/types/OrderTypes';
import Web3 from 'web3';
// @ts-ignore
import { Callback } from 'web3/types';
import { MatchedOrders } from '@tracer-protocol/contracts/types/TracerPerpetualSwaps';
import { useUsersMatched } from '@libs/Graph/hooks/Account';
import BigNumber from 'bignumber.js';
import { useWeb3 } from '@context/Web3Context/Web3Context';

type Orders = {
    askOrders: FlattenedOMEOrder[];
    bidOrders: FlattenedOMEOrder[];
};

const sortDesc: (orders: FlattenedOMEOrder[]) => FlattenedOMEOrder[] = (orders: FlattenedOMEOrder[]) =>
    orders.sort((a, b) => b.price - a.price);

export const parseOrders: (res: any) => Orders = (res) => {
    const parseOrders = (orders: OMEOrder) => {
        const sections = Object.values(orders);
        const flattenedOrders = sections.map((orders: any) =>
            orders.reduce(
                (prev: any, order: { remaining: number; price: number }) => ({
                    price: parseFloat(Web3.utils.fromWei(order.price.toString())), // price remains the same,
                    quantity: prev.quantity + parseFloat(Web3.utils.fromWei(order.remaining.toString())),
                }),
                {
                    quantity: 0,
                },
            ),
        );
        return flattenedOrders.filter((row) => row.quantity); // remove 0 entries
    };

    return {
        askOrders: parseOrders(res?.asks ?? []),
        bidOrders: sortDesc(parseOrders(res?.bids ?? [])),
    };
};

interface ContextProps {
    omeState: OMEState;
    omeDispatch: React.Dispatch<OMEAction>;
    filledOrders: FilledOrder[];
    refetchFilledOrders: (...args: any) => any;
}

type OMEState = {
    userOrders: OMEOrder[];
    orders: Orders;
    maxAndMins: {
        minBid: number;
        maxBid: number;
        minAsk: number;
        maxAsk: number;
    };
    lastTradePrice: BigNumber;
    marketUp: boolean;
};
type OMEAction =
    | { type: 'setUserOrders'; orders: OMEOrder[] }
    | { type: 'setOrders'; orders: Orders }
    | { type: 'refetchUserOrders' }
    | { type: 'setLastTradePrice'; ltp: BigNumber }
    | { type: 'setMarketUp'; value: boolean }
    | {
          type: 'setBestPrices';
          maxAndMins: {
              minBid: number;
              maxBid: number;
              minAsk: number;
              maxAsk: number;
          };
      }
    | { type: 'refetchOrders' };

export const OMEContext = React.createContext<Partial<ContextProps>>({});

/**
 * Provides a store of OME data that can be updated, used and refetched by all children
 *  of the store.
 * FilledOrders are also fetched in this context to keep order related things in one context.
 * FilledOrders are fetched from The Graph through the useUsersMatched hook.
 * This could eventually incorporate a websocket connection or be removed in place of
 *  a WS with direct connection to the OME and/or API
 */
export const OMEStore: React.FC<Children> = ({ children }: Children) => {
    const isMounted = useRef(true);
    const { account } = useWeb3();
    const { selectedTracer } = useContext(TracerContext);

    const { filledOrders, refetchFilledOrders } = useUsersMatched(selectedTracer?.address ?? '', account ?? '');

    const initialState: OMEState = {
        userOrders: [],
        orders: {
            askOrders: [],
            bidOrders: [],
        },
        maxAndMins: {
            minBid: 0,
            maxBid: 0,
            minAsk: 0,
            maxAsk: 0,
        },
        lastTradePrice: new BigNumber(0),
        marketUp: false,
    };

    const fetchUserData = async () => {
        if (!account) {
            if (isMounted.current) {
                omeDispatch({ type: 'setUserOrders', orders: [] });
            }
        }
        if (selectedTracer?.address && account) {
            const res = await getUsersOrders(selectedTracer?.address as string, account);
            if (isMounted.current) {
                omeDispatch({ type: 'setUserOrders', orders: res });
            }
        }
    };

    const matchedOrders: Callback<MatchedOrders> = (err: Error, res: MatchedOrders) => {
        if (err) {
            console.error('Failed to listen on matched orders', err.message);
        } else if (
            account?.toLocaleLowerCase() === res.returnValues.long.toLowerCase() ||
            account?.toLocaleLowerCase() === res.returnValues.short.toLowerCase()
        ) {
            refetchFilledOrders();
        }
    };

    useEffect(() => {
        if (selectedTracer) {
            fetchUserData();
            selectedTracer?.updateFeeRate();
            if (!selectedTracer?.hasSubscribed) {
                selectedTracer?.subscribeToMatchedOrders(matchedOrders);
            }
        }
    }, [selectedTracer]);

    const fetchOrders = async () => {
        if (selectedTracer?.address) {
            const res = await getOrders(selectedTracer?.address);
            if (isMounted.current) {
                const parsedOrders = parseOrders(res);
                const minAsk = parsedOrders.askOrders[0]?.price ?? 0;
                const maxAsk = parsedOrders.askOrders.slice(-1)[0]?.price ?? 0;
                // swapped for bids since they are descending
                const minBid = parsedOrders.bidOrders.slice(-1)[0]?.price ?? 0;
                const maxBid = parsedOrders.bidOrders[0]?.price ?? 0;
                omeDispatch({ type: 'setOrders', orders: parsedOrders });
                omeDispatch({
                    type: 'setBestPrices',
                    maxAndMins: {
                        minBid: minBid,
                        maxBid: maxBid,
                        minAsk: minAsk,
                        maxAsk: maxAsk,
                    },
                });
                // precision here isnt that necessary to fixing it to 20 is ok
                const ltp = new BigNumber(
                    Web3.utils.fromWei((res?.LTP ?? 0).toLocaleString('fullwide', { useGrouping: false })),
                );
                omeDispatch({
                    type: 'setMarketUp',
                    value: ltp.gt(omeState.lastTradePrice),
                });
                omeDispatch({
                    type: 'setLastTradePrice',
                    ltp: ltp,
                });
            }
        }
    };

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }; // cleanup dismount
    }, []);

    const reducer = (state: OMEState, action: OMEAction) => {
        switch (action.type) {
            case 'setUserOrders':
                return { ...state, userOrders: action.orders };
            case 'setOrders': {
                return { ...state, orders: action.orders };
            }
            case 'setBestPrices': {
                return {
                    ...state,
                    maxAndMins: action.maxAndMins,
                };
            }
            case 'setMarketUp': {
                return {
                    ...state,
                    marketUp: action.value,
                };
            }
            case 'setLastTradePrice': {
                return {
                    ...state,
                    lastTradePrice: action.ltp,
                };
            }
            case 'refetchUserOrders': {
                fetchUserData();
                return { ...state };
            }
            case 'refetchOrders': {
                fetchOrders();
                return { ...state };
            }
            default:
                throw new Error('Unexpected action');
        }
    };

    const [omeState, omeDispatch] = useReducer(reducer, initialState);

    useMemo(() => {
        fetchUserData();
    }, [selectedTracer?.address, account]);

    useEffect(() => {
        // fetches orders every 6 seconds
        // TODO update this as it triggers a re-render for all using the OMEStore
        let id: any;
        if (!!selectedTracer) {
            fetchOrders();
            id = setInterval(() => fetchOrders(), 6000);
        }
        return () => {
            clearInterval(id);
        };
    }, [selectedTracer]);

    return (
        <OMEContext.Provider
            value={{
                omeDispatch,
                omeState,
                filledOrders,
                refetchFilledOrders,
            }}
        >
            {children}
        </OMEContext.Provider>
    );
};
