import { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { FactoryContext } from '@context/FactoryContext';
import { ErrorContext } from '@context/ErrorInfoContext';
import oracleJSON from '@tracer-protocol/contracts/build/contracts/Oracle.json';

import erc20JSON from '@tracer-protocol/contracts/build/contracts/ERC20.json';
import { AbiItem } from 'web3-utils';

import { TakenOrder, OpenOrder, Result, Tracer } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
import { Web3Context } from 'context';
import { Contract } from '@lions-mane/web3-redux';
import { checkAllowance } from '@libs/web3/utils';
import { fromCents } from '@libs/utils';
import tracerJSON from '@tracer-protocol/contracts/build/contracts/Tracer.json';

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

/** Helpers to clean it up a little */
const useBaseTokenBalance = (account: string, networkId: string, tracerBaseToken: string) => {
    const baseToken = useSelector((state) => Contract.selectSingle(state, `${networkId}-${tracerBaseToken}`));
    const _baseTokenBalance = useSelector((state) =>
        Contract.selectContractCall(state, baseToken ? baseToken.id : '', 'balanceOf', {
            args: [account],
            from: account,
        }),
    );

    const baseTokenBalance = useMemo(() => {
        return _baseTokenBalance ? parseFloat(Web3.utils.fromWei(_baseTokenBalance)) : 0;
    }, [_baseTokenBalance]);

    return baseTokenBalance;
};

const useOracle = (networkId_: string, oracleAddress: string) => {
    const reduxDispatch = useDispatch();
    const oracleContract = useSelector((state) => Contract.selectSingle(state, `${networkId_}-${oracleAddress}`));
    const contractId = oracleContract?.id ?? '';
    const networkId = oracleContract?.networkId ?? '';
    const address = oracleContract?.address ?? '';

    useEffect(() => {
        if (!!oracleContract) {
            reduxDispatch(
                Contract.callSynced({
                    networkId: networkId?.toString(),
                    address: address,
                    method: 'latestAnswer',
                    sync: Contract.CALL_TRANSACTION_SYNC,
                }),
            );
        }
    }, [oracleContract]);

    const _oraclePrice = useSelector((state) => Contract.selectContractCall(state, contractId, 'latestAnswer'));

    const oraclePrice = useMemo(() => {
        return _oraclePrice ?? 0;
    }, [_oraclePrice]);

    return oraclePrice;
};

const useUserTracerBalance = (account: string, contractId: string) => {
    const balance = useSelector((state) =>
        Contract.selectContractCall(state, contractId, 'tracerGetBalance', {
            args: [account],
        }),
    );

    const userBalance = useMemo(() => {
        if (!!balance) {
            return {
                margin: parseFloat(Web3.utils.fromWei(balance[0])),
                position: parseFloat(Web3.utils.fromWei(balance[1])),
                deposited: parseFloat(Web3.utils.fromWei(balance[3])),
                totalLeveragedValue: parseFloat(Web3.utils.fromWei(balance[2])),
                lastUpdatedGasPrice: parseFloat(Web3.utils.fromWei(balance[4])),
                walletBalance: 0,
            };
        }
        return {
            margin: 0,
            position: 0,
            deposited: 0,
            totalLeveragedValue: 0,
            lastUpdatedGasPrice: 0,
            walletBalance: 0,
        };
    }, [balance]);

    return userBalance;
};

export const useTracer = (tracer: string) => {
    const { account, networkId: _networkId, web3, config } = useContext(Web3Context);
    const contractCalls = [
        {
            method: 'oracle',
            sync: Contract.CALL_TRANSACTION_SYNC,
        },
        {
            method: 'tracerBaseToken',
            sync: Contract.CALL_TRANSACTION_SYNC,
        },
        {
            method: 'marketId',
            sync: Contract.CALL_TRANSACTION_SYNC,
        },
        {
            method: 'priceMultiplier',
            sync: Contract.CALL_TRANSACTION_SYNC,
        },
        {
            method: 'LIQUIDATION_GAS_COST',
            sync: Contract.CALL_TRANSACTION_SYNC,
        },
        {
            method: 'feeRate',
            sync: Contract.CALL_TRANSACTION_SYNC,
        },
        {
            method: 'tracerGetBalance',
            args: [account],
            sync: false,
        },
    ];

    const contract = useSelector((state) =>
        Contract.selectSingle(state, `${_networkId?.toString()}-${Web3.utils.toChecksumAddress(tracer)}`),
    ) as Contract.Contract | undefined;
    const reduxDispatch = useDispatch();
    const contractSet = useRef<Record<string, boolean>>({});

    const contractId = contract?.id ?? '';
    const networkId = contract?.networkId ?? '';
    const address = contract?.address ?? '';

    useEffect(() => {
        if (!!contractId && !!networkId && !!account) {
            if (!contractSet.current[`${contractId}-${account}`]) {
                contractSet.current = {
                    ...contractSet.current,
                    [`${contractId}-${account}`]: true,
                };
                contractCalls.map(({ method, sync, args }) => {
                    reduxDispatch(
                        Contract.callSynced({
                            networkId: networkId,
                            address: address,
                            method: method,
                            sync: sync,
                            args: args,
                        }),
                    );
                });
            }
        }
    }, [contractId, networkId, account]);
    // use all getters
    const tracerBaseToken = useSelector((state) => Contract.selectContractCall(state, contractId, 'tracerBaseToken'));
    const oracle = useSelector((state) => Contract.selectContractCall(state, contractId, 'oracle'));
    const priceMultiplier = useSelector((state) => Contract.selectContractCall(state, contractId, 'priceMultiplier'));
    const fundingRate = useSelector((state) => Contract.selectContractCall(state, contractId, 'feeRate'));

    // const gasOracle = useSelector((state) =>
    //     Contract.selectContractCall(state, contractId, 'gasPriceOracle', {
    //         from: account ?? undefined,
    //     }),
    // );

    // const marketId = useSelector((state) =>
    //     Contract.selectContractCall(state, contractId, 'marketId', {
    //         from: account ?? undefined,
    //     }),
    // );

    // const liquidationGasCost = useSelector((state) =>
    //     Contract.selectContractCall(state, contractId, 'LIQUIDATION_GAS_COST', {
    //         from: account ?? undefined,
    //     }),
    // );

    useEffect(() => {
        if (!!tracerBaseToken) {
            reduxDispatch(
                Contract.create({
                    address: Web3.utils.toChecksumAddress(tracerBaseToken),
                    abi: erc20JSON.abi as AbiItem[],
                    networkId: networkId?.toString() as string,
                }),
            );
        }
    }, [tracerBaseToken]);

    useEffect(() => {
        if (!!tracerBaseToken && !!account) {
            reduxDispatch(
                Contract.callSynced({
                    networkId: networkId.toString(),
                    address: tracerBaseToken,
                    method: 'balanceOf',
                    sync: false,
                    args: [account],
                    from: account,
                }),
            );
        }
    }, [tracerBaseToken, account]);

    useEffect(() => {
        if (!!oracle) {
            reduxDispatch(
                Contract.create({
                    address: oracle,
                    abi: oracleJSON.abi as AbiItem[],
                    networkId: networkId?.toString() as string,
                }),
            );
        }
    }, [oracle]);

    const baseTokenBalance = useBaseTokenBalance(account ?? '', networkId?.toString(), tracerBaseToken);
    const oraclePrice = useOracle(networkId?.toString(), oracle);
    const balance = useUserTracerBalance(account ?? '', contractId);

    /**
     * Places an on chain order, fillable by any part on chain.
     * @param amount the amount of Tracers to buy
     * @param price the price in dollars to buy the tracer at
     * @param side the side of the order. True for long, false for short.
     * @param expiration the expiry time for this order
     */
    const makeOrder: (amount: number, price: number, side: boolean) => Promise<Result> = async (
        amount,
        price,
        side,
    ) => {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);

        reduxDispatch(
            Contract.send({
                networkId,
                address,
                method: 'makeOrder',
                args: [
                    Web3.utils.toWei(amount.toString()),
                    price * priceMultiplier,
                    side ? true : false,
                    Math.round(expiration.getTime() / 1000).toString(),
                ],
                from: account as string,
            }),
        );

        return { status: 'success', message: 'Successfully created orders' };

        // try {
        //     await
        // } catch (err) {
        //     console.error(err);
        //     return { status: 'error', error: err };
        // }
    };

    /**
     * Takes an on chain order, in whole or in part. Order is executed at the makers
     *  defined price.
     * @param orderId the ID of the order to be filled. Emitted in the makeOrder function
     * @param amount the amount of the order to fill.
     */
    const takeOrders: (orders: TakenOrder[]) => Promise<Result> = async (orders) => {
        try {
            const ARBITRARY_AMOUNT = 420;
            await checkAllowance(
                web3,
                tracerBaseToken,
                account as string,
                config?.contracts.account.address as string,
                ARBITRARY_AMOUNT,
            );
            console.info(`Account ${account?.slice()} is taking orders`, orders);
            for (const order of orders) {
                reduxDispatch(
                    Contract.send({
                        networkId,
                        address,
                        method: 'takeOrder',
                        args: [order.id, Web3.utils.toWei(order.amount.toString())],
                        from: account as string,
                    }),
                );
            }
            // batching still requires you to confirm multiple times
            // var batch = new this._web3.BatchRequest();
            // for (var order of orders) {
            //     batch.add(
            //         this._instance.methods
            //             .takeOrder(order.id, Web3.utils.toWei(order.amount.toString())).send.request({from: from})
            //     )
            // }
            // await batch.execute();
            return { status: 'success', message: 'Successfully took orders' };
        } catch (err) {
            console.error(err);
            return { status: 'error', error: err };
        }
    };

    return {
        // oracle,
        tracerBaseToken,
        baseTokenBalance,
        balance,
        oraclePrice,
        priceMultiplier,
        fundingRate: fundingRate ?? 0,
        matchingFee: 0,
        makeOrder,
        takeOrders,
        // gasOracle,
        // liquidationGasCost,
    };
};
