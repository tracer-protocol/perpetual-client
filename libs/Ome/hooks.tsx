import { useState, useEffect } from 'react';
import { OMEOrder as FlattenedOMEOrder } from 'types/OrderTypes';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { getOrders, getUsersOrders } from '.';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

type Orders = {
    askOrders: FlattenedOMEOrder[];
    bidOrders: FlattenedOMEOrder[];
};

export const useOpenOrders: (selectedTracer: string, account: string) => OMEOrder[] = (selectedTracer, account) => {
    const [userOrders, setUserOrders] = useState<OMEOrder[]>([]);
    useEffect(() => {
        let mounted = true;
        const fetchUserData = async () => {
            const res = await getUsersOrders(selectedTracer as string, account);
            if (mounted) {
                setUserOrders(res);
            }
        };
        if (selectedTracer && account) {
            fetchUserData();
        }
        return () => {
            mounted = false; // cleanup
        };
    }, [selectedTracer, account]);

    return userOrders;
};

const parseRes: (res: any) => Orders = (res) => {
    const parseOrders = (orders: any) => {
        const sections = Object.values(orders);
        const flattenedOrders = sections.map((orders: any) =>
            orders.reduce(
                (prev: any, order: { amount: number; price: number }) => ({
                    price: new BigNumber(Web3.utils.fromWei(order.price.toString())), // price remains the same,
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

export const useOrders: (selectedTracer: string) => Orders = (selectedTracer) => {
    const [orders, setOrders] = useState<Orders>({
        askOrders: [],
        bidOrders: [],
    });

    useEffect(() => {
        // fetches orders every 5 seconds
        let mounted = true;
        const fetchData = async () => {
            const res = await getOrders(selectedTracer as string);
            if (mounted) {
                setOrders(parseRes(res));
            }
        };
        let id: any;
        if (!!selectedTracer) {
            fetchData();
            id = setInterval(() => fetchData(), 5000);
        }
        return () => {
            clearInterval(id);
            mounted = false;
        };
    }, [selectedTracer]);
    return orders;
};
