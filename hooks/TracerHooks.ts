import { useEffect, useState, useContext } from 'react';
import { FactoryContext } from '@context/FactoryContext';
import { AbiItem } from 'web3-utils';

import { OpenOrder } from 'types';
import Web3 from 'web3';
import { fromCents } from '@libs/utils';
import tracerJSON from '@tracer-protocol/contracts/build/contracts/Tracer.json';
import { Tracer } from 'libs';
import { Tracer as TracerType } from '@tracer-protocol/contracts/types/web3-v1-contracts/Tracer';

/**
 * Function which gets all available market pairs from the tracer factory.
 * Returns a mapping from the of string keys to an array of strings.
 * The key value will be the asset providing collateral and the array of strings
 *  will be all relative tracer markets.
 */
export const useMarketPairs: () => Record<string, string[]> = () => {
    const [marketPairs, setMarketPairs] = useState<Record<string, string[]>>({});
    const { tracers } = useContext(FactoryContext);
    useEffect(() => {
        if (tracers) {
            const pairs: Record<string, string[]> = {};
            for (const key of Object.keys(tracers)) {
                const pair: string[] = key.split('/');
                if (pairs[pair[1]]) {
                    pairs[pair[1]].push(pair[0]);
                } else {
                    pairs[pair[1]] = [pair[0]];
                }
            }
            setMarketPairs(pairs);
        }
    }, [tracers]);

    return marketPairs;
};

/**
 *
 * @param position true for long, false for short
 * @param tracer current selected tracer
 * @returns 2 arrays, short orders and long orders respectively
 */
export const useTracerOrders: (web3: Web3 | undefined, tracer: Tracer) => Record<string, OpenOrder[]> = (
    web3,
    tracer,
) => {
    const [contract, setContract] = useState<TracerType>();

    useEffect(() => {
        if (web3 && tracer) {
            setContract((new web3.eth.Contract(tracerJSON.abi as AbiItem[], tracer.address) as unknown) as TracerType);
        }
    }, [web3, tracer]);
    const [openOrders, setOpenOrders] = useState<Record<string, OpenOrder[]>>({ longOrders: [], shortOrders: [] });

    /**
     * Gets all open orders placed on chain. First gets the total count of orders and
     * then iterates through the count getting all open orders
     * @return an array of order objects {order amount, amount filled, price and the side of an order, address, id}
     */
    const getOpenOrders: () => Promise<Record<string, OpenOrder[]>> = async () => {
        if (!contract) {
            return Promise.resolve({});
        }
        const shortOrders = [];
        const longOrders = [];
        // This is really annoying to do with the web3-redux store so just initiated a contract instance
        const count = await contract.methods.orderCounter().call();
        for (let i = 0; i < parseInt(count); i++) {
            const rawOrder = await contract.methods.getOrder(i).call();

            // Amount = filled, not open
            // TODO if the amount not filled is very small this will fail
            const amount = parseFloat(Web3.utils.fromWei(rawOrder[0]));
            const filled = parseFloat(Web3.utils.fromWei(rawOrder[1]));
            if (amount !== filled) {
                const order = {
                    amount: amount,
                    filled: filled,
                    price: fromCents(parseFloat(rawOrder[2])),
                    side: rawOrder[3],
                    maker: rawOrder[4],
                    id: i,
                };
                rawOrder[3] ? longOrders.push(order) : shortOrders.push(order);
            }
        }
        // short orders we want in ascending order since the long wants the lowest priced short
        // opposite for long, the shorts want the highest priced long so put longs in descending
        shortOrders.sort((a, b) => a.price - b.price);
        longOrders.sort((a, b) => b.price - a.price);
        return { shortOrders: shortOrders, longOrders: longOrders };
    };

    useEffect(() => {
        let mounted = true;
        if (contract) {
            getOpenOrders().then((orders) => {
                if (mounted) {
                    setOpenOrders(orders);
                }
            });
        }
        return function cleanup() {
            mounted = false;
        };
    }, [contract]);

    return openOrders;
};
