import { useEffect, useState, useRef, useContext } from 'react';
import { FactoryContext } from '@context/FactoryContext';
import { ErrorContext } from '@context/ErrorInfoContext';
import { AbiItem } from 'web3-utils';

import { TakenOrder, OpenOrder } from 'types';
import Web3 from 'web3';
import { fromCents } from '@libs/utils';
import tracerJSON from '@tracer-protocol/contracts/build/contracts/Tracer.json';
import { Tracer } from '@components/libs';

/**
 * Calculates a theoretical market exposure if it took all the 'best' orders it could
 *  Returns this exposure and the orders that allow it to gain this exposure
 * @param rMargin margin entered to use by the user
 * @param leverage leverage of the trade
 * @param position long or short boolean pepresentation of the position
 */
export const useCalcExposure: (
    // this is my shitty order book implementation
    rMargin: number,
    leverage: number,
    position: boolean,
    orders: OpenOrder[],
) => { exposure: number; takenOrders: TakenOrder[]; tradePrice: number } = (rMargin, leverage, position, orders) => {
    const { setError } = useContext(ErrorContext);
    const [exposure, setExposure] = useState(0);
    const [tradePrice, setTradePrice] = useState(0);
    const [takenOrders, setTakenOrders] = useState<TakenOrder[]>([]);

    useEffect(() => {
        if (orders.length) {
            // const oppositeOrders = position ? openOrders[0] : openOrders[1];
            let exposure = 0,
                totalUnitPrice = 0,
                units = 0;
            const takenOrders: TakenOrder[] = [];
            let partialOrder = false;
            let deposit = rMargin * leverage; // units of underlying
            for (const order of orders) {
                const orderR = order.amount - order.filled; // units of asset
                const orderPrice = order.price;
                const r = deposit - orderR * orderPrice;
                if (r >= 0) {
                    // if it can eat the whole order
                    totalUnitPrice += orderPrice * orderR;
                    units += orderR;
                    exposure += orderR; // units of the assets
                    deposit -= orderR * orderPrice; // subtract the remainder in units of underLying
                    takenOrders.push({
                        id: order.id,
                        amount: orderR,
                        price: order.price,
                    });
                } else {
                    // eat a bit of the order nom nom
                    if (deposit) {
                        totalUnitPrice += deposit;
                        units += deposit / orderPrice;
                        exposure += deposit / orderPrice;
                        takenOrders.push({
                            id: order.id,
                            amount: deposit / orderPrice, // take what is yours
                            price: order.price,
                        });
                        partialOrder = true;
                    }
                    break;
                }
            }
            // condition is taken all orders
            const condition = takenOrders.length === orders.length && !partialOrder && orders.length;
            condition ? setError(2, 2) : setError(0, 2);
            setExposure(parseFloat(exposure.toFixed(10)));
            setTradePrice(units ? totalUnitPrice / units : orders[0].price); // market price if no trade price
            setTakenOrders(takenOrders);
        }
    }, [orders, rMargin, leverage, position]);

    return { exposure, takenOrders, tradePrice };
};

/**
 * Function which closes the users positions by taking the appropriate trades
 *
 */
export const useClosePosition: (position: number, openOrders: Record<string, OpenOrder[]>) => TakenOrder[] = (
    position,
    openOrders,
) => {
    const [takenOrders, setTakenOrders] = useState<TakenOrder[]>([]);
    useEffect(() => {
        if (openOrders && position) {
            const oppositeOrders = position < 0 ? openOrders.shortOrders : openOrders.longOrders;
            // position > 0 is a long position, thus interested in short orders
            const takenOrders: TakenOrder[] = [];
            let closingPosition = Math.abs(position);
            for (const order of oppositeOrders) {
                const orderR = order.amount - order.filled;
                const r = closingPosition - orderR;
                if (r >= 0) {
                    // take whole order
                    closingPosition -= orderR;
                    takenOrders.push({
                        id: order.id,
                        amount: orderR, // take what is yours
                        price: order.price,
                    });
                } else {
                    // take partial order
                    takenOrders.push({
                        id: order.id,
                        amount: closingPosition, // take what is yours
                        price: order.price,
                    });
                    break;
                }
            }
            setTakenOrders(takenOrders);
        }
    }, [openOrders, position]);

    return takenOrders;
};

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

export const useAdvancedTradingMarkets: () => string[][] = () => {
    const { tracers } = useContext(FactoryContext);

    const [rows, setRows] = useState<string[][]>([]);
    useEffect(() => {
        if (tracers) {
            const ids = Object.keys(tracers);
            setRows(
                ids.map((id) => {
                    return [id, '11, 345 USDC', '+0.13%', '-0.13%'];
                }),
            );
        }
    }, [tracers]);

    return rows;
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
    const contract = useRef<any>();
    const [openOrders, setOpenOrders] = useState<Record<string, OpenOrder[]>>({ longOrders: [], shortOrders: [] });

    /**
     * Gets all open orders placed on chain. First gets the total count of orders and
     * then iterates through the count getting all open orders
     * @return an array of order objects {order amount, amount filled, price and the side of an order, address, id}
     */
    const getOpenOrders: () => Promise<Record<string, OpenOrder[]>> = async () => {
        const shortOrders = [];
        const longOrders = [];
        // This is really annoying to do with the web3-redux store so just initiated a contract instance
        const count = await contract?.current?.methods.orderCounter().call();
        for (let i = 0; i < parseInt(count); i++) {
            const rawOrder = await contract?.current?.methods.getOrder(i).call();

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
        if (web3?.eth && !contract.current && tracer) {
            console.info(tracer, 'Found tracer');
            contract.current = new web3.eth.Contract(tracerJSON.abi as AbiItem[], tracer.address);
        }
    }, [web3, tracer]);

    useEffect(() => {
        let mounted = true;
        if (tracer) {
            getOpenOrders().then((orders) => {
                if (mounted) {
                    setOpenOrders(orders);
                }
            });
        }
        return function cleanup() {
            mounted = false;
        };
    }, [tracer]);

    return openOrders;
};
