import { getOrders, getUsersOrders } from '@libs/Ome';
import { OMEOrder as FlattenedOMEOrder } from 'types/OrderTypes';
import React, { useContext, useEffect, useReducer } from 'react';
import { Children } from 'types';
import Web3 from 'web3';
import { TracerContext } from './TracerContext';
import { Web3Context } from './Web3Context';
import { OMEOrder } from '@tracer-protocol/tracer-utils';

interface ContextProps {
    orders: {
        askOrders: FlattenedOMEOrder[],
        bidOrders: FlattenedOMEOrder[]
    }, 
    userOrders: OMEOrder[]
}

type Orders = {
    askOrders: FlattenedOMEOrder[],
    bidOrders: FlattenedOMEOrder[]
}

type OMEState = {
    orders: Orders,
    userOrders: OMEOrder[]
}

export const OMEContext = React.createContext<Partial<ContextProps>>({});
export type OrderAction =
    | { type: 'setUserOrders'; orders: OMEOrder[] }
    | { type: 'setOpenOrders'; orders: Orders }

const parseRes = (res: any ) => {
    const parseOrders = (orders: any) => {
        const sections = Object.values(orders);
        const flattenedOrders = sections.map((orders: any) =>
            orders.reduce(
                (prev: any, order: { amount: number; price: number }) => ({
                    price: order.price, // price remains the same,
                    quantity: prev.quantity + parseFloat(Web3.utils.fromWei(order.amount.toString())),
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

export const OMEStore: React.FC<Children> = ({ children }: Children) => {
    const { account } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);
    const initialState: OMEState = {
        orders: {
            askOrders: [],
            bidOrders: [],
        },
        userOrders: []
    };

    const reducer = (state: any, action: OrderAction) => {
        switch (action.type) {
            case 'setUserOrders':
                return { ...state, userOrders: action.orders };
            case 'setOpenOrders': 
                return { ...state, orders: action.orders }
            default:
                throw new Error('Unexpected OME dispatch action');
        }
    };

    const [omeState, omeDispatch] = useReducer(reducer, initialState);

    useEffect(() => { // fetches orders every 5 seconds
        const fetchData = async () => {
            const res = await getOrders(selectedTracer?.address as string);
            omeDispatch({ type: 'setOpenOrders', orders: parseRes(res) })
        };
        let id: any;
        if (!!selectedTracer?.address) {
            fetchData();
            id = setInterval(() => fetchData(), 5000);
        }
        return () => clearInterval(id);
    }, [selectedTracer?.address]);

    const fetchUserData = async () => {
        if (selectedTracer?.address && account) {
            const res = await getUsersOrders(selectedTracer?.address as string, account);
            omeDispatch({ type: 'setUserOrders', orders: res })
        }
    } 

    useEffect(() => { fetchUserData()}, [selectedTracer, account])
    

    return (
        <OMEContext.Provider
            value={{
                ...omeState
            }}
        >
            {children}
        </OMEContext.Provider>
    );
};
