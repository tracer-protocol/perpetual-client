import React, { useContext, useEffect, useReducer } from 'react';
import { FactoryContext } from './FactoryContext';
import { Children, Result, TakenOrder, UserBalance } from 'types';
import { isEmpty } from 'lodash';
import { createBook } from '@libs/Ome';
import { Web3Context } from './Web3Context';
import { OrderState } from './OrderContext';
import Web3 from 'web3';
import { signOrders, orderToOMEOrder, OrderData } from '@tracer-protocol/tracer-utils';
import { createOrder } from '@libs/Ome';
import Tracer from '@libs/Tracer';
import { TransactionContext } from './TransactionContext';

interface ContextProps {
    tracerId: string | undefined;
    setTracerId: (tracerId: string) => any;
    selectedTracer: Tracer | undefined;
    baseAsset: string | undefined;
    quoteAsset: string | undefined;
    balance: UserBalance;
    placeOrder: (order: OrderState, takenOrders: TakenOrder[]) => Promise<Result | undefined>;
}

export const TracerContext = React.createContext<Partial<ContextProps>>({});

type TracerState = {
    tracerId: string;
    selectedTracer: Tracer | undefined;
    balance: UserBalance;
};

type StoreProps = {
    tracer?: string;
} & Children;

export const SelectedTracerStore: React.FC<StoreProps> = ({ tracer, children }: StoreProps) => {
    const { account, web3, config } = useContext(Web3Context);
    const { tracers } = useContext(FactoryContext);
    const { handleTransaction } = useContext(TransactionContext);
    const initialState: TracerState = {
        tracerId: tracer || 'TEST0/USD',
        selectedTracer: undefined,
        balance: {
            quote: 0,
            base: 0,
            totalLeveragedValue: 0,
            lastUpdatedGasPrice: 0,
            tokenBalance: 0,
        },
    };

    const reducer = (state: TracerState, action: Record<string, any>) => {
        switch (action.type) {
            case 'setTracerId':
                return { ...state, tracerId: action.value };
            case 'setSelectedTracer':
                return { ...state, selectedTracer: action.value };
            case 'setUserBalance':
                return { ...state, balance: action.value };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [tracerState, tracerDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!isEmpty(tracers)) {
            tracerDispatch({ type: 'setSelectedTracer', value: tracers?.[tracerId] });
            createBook(tracers?.[tracerId] as Tracer);
        }
    }, [tracers, tracerState.tracerId]);

    useEffect(() => {
        if (tracer) {
            tracerDispatch({ type: 'setTracerId', value: tracer });
        }
    }, [tracer]);

    const { tracerId, selectedTracer, balance } = tracerState;

    const fetchUserData = async () => {
        if (tracers) {
            const userData = await Promise.all(
                Object.values(tracers).map((tracer: Tracer) => tracer?.updateUserBalance(account)),
            );
            tracerDispatch({ type: 'setUserBalance', value: userData[0] });
        }
    };

    const placeOrder = async (order: OrderState, takenOrders: TakenOrder[]) => {
        const { rMargin, price, orderType, position, matchingEngine } = order;
        if (matchingEngine === 1) {
            // OME order
            const parsedPrice = price * selectedTracer?.priceMultiplier;
            const amount = Web3.utils.toWei(rMargin.toString()) ?? 0;
            const expiration = new Date().getTime() + 604800;
            const makes: OrderData[] = [
                {
                    amount: amount,
                    price: parsedPrice.toString(),
                    side: position === 0,
                    user: account ?? '',
                    expiration: expiration,
                    targetTracer: selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer.address) : '',
                    nonce: 5101,
                },
            ];
            const signedMakes = await signOrders(web3, makes, config?.contracts.trader.address as string);
            const order = orderToOMEOrder(web3, await signedMakes[0]);
            await createOrder(selectedTracer?.address as string, order);
            return { status: 'success' } as Result; // TODO add error check
        } else if (matchingEngine === 0) {
            // On-chain
            if (orderType === 0) {
                if (!selectedTracer?.takeOrders) {
                    return {
                        status: 'error',
                        message: 'Failed to take order: Take order function is undefined',
                    } as Result;
                } else {
                    handleTransaction
                        ? await handleTransaction(selectedTracer.takeOrders, [takenOrders ?? [], account])
                        : console.error('Failed to make order: Handle transaction function undefined');
                }
            } else if (orderType === 1) {
                if (!selectedTracer?.makeOrder) {
                    return {
                        status: 'error',
                        message: 'Failed to make order: Make order function is undefined',
                    } as Result;
                } else {
                    handleTransaction
                        ? await handleTransaction(selectedTracer.makeOrder, [
                              rMargin,
                              Math.round(price * 1000000),
                              position === 1, // if === 1 then long else false short
                              account,
                          ])
                        : console.error('Failed to create order: Handle transaction function undefined');
                }
            }
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const balance = await selectedTracer?.updateUserBalance(account);
            tracerDispatch({ type: 'setUserBalance', value: balance });
        };
        fetch();
    }, [account]);

    useEffect(() => {
        if (selectedTracer) {
            fetchUserData();
            selectedTracer?.updateFeeRate();
        }
    }, [selectedTracer]);

    const [baseAsset, quoteAsset] = tracerId.split('/');

    return (
        <TracerContext.Provider
            value={{
                tracerId,
                setTracerId: (tracerId: string) => tracerDispatch({ type: 'setTracerId', value: tracerId }),
                selectedTracer,
                baseAsset,
                quoteAsset,
                balance,
                placeOrder,
            }}
        >
            {children}
        </TracerContext.Provider>
    );
};
