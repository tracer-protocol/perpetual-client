import { getOrders, getUsersOrders } from '@libs/Ome';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import React, { useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Children } from 'types';
import { TracerContext } from './TracerContext';
import { Web3Context } from './Web3Context';
import { OMEOrder as FlattenedOMEOrder } from 'types/OrderTypes';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

type Orders = {
    askOrders: FlattenedOMEOrder[];
    bidOrders: FlattenedOMEOrder[];
};

export const parseOrders: (res: any) => Orders = (res) => {
    const parseOrders = (orders: OMEOrder) => {
        const sections = Object.values(orders);
        const flattenedOrders = sections.map((orders: any) =>
            orders.reduce(
                (prev: any, order: { amount_left: number; price: number }) => ({
                    price: new BigNumber(Web3.utils.fromWei(order.price.toString())), // price remains the same,
                    quantity: prev.quantity + parseFloat(Web3.utils.fromWei(order.amount_left.toString())),
                }),
                {
                    quantity: 0,
                },
            ),
        );
        return flattenedOrders;
    };

    return {
        askOrders: parseOrders(res?.asks ?? {}),
        bidOrders: parseOrders(res?.bids ?? {}),
    };
};

interface ContextProps {
    omeState: OMEState;
    omeDispatch: React.Dispatch<OMEAction>;
}

type OMEState = {
    userOrders: OMEOrder[];
    orders: Orders;
};
type OMEAction =
    | { type: 'setUserOrders'; orders: OMEOrder[] }
    | { type: 'setOrders'; orders: Orders }
    | { type: 'refetchUserOrders' }
    | { type: 'refetchOrders' };

export const OMEContext = React.createContext<Partial<ContextProps>>({});

export const OMEStore: React.FC<Children> = ({ children }: Children) => {
    const isMounted = useRef(true);
    const { account } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);

    const initialState: OMEState = {
        userOrders: [],
        orders: {
            askOrders: [],
            bidOrders: [],
        },
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

    const fetchOrders = async () => {
        if (selectedTracer?.address) {
            const res = await getOrders(selectedTracer?.address);
            if (isMounted.current) {
                omeDispatch({ type: 'setOrders', orders: parseOrders(res) });
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
        // fetches orders every 5 seconds
        // TODO update this as it triggers a re-render for all using the OMEStore
        let id: any;
        if (!!selectedTracer) {
            fetchOrders();
            id = setInterval(() => fetchOrders(), 5000);
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
            }}
        >
            {children}
        </OMEContext.Provider>
    );
};
