import React, { useContext, useEffect, useReducer } from 'react';
import { FactoryContext } from './FactoryContext';
import { Children, Result, UserBalance } from 'types';
import { isEmpty } from 'lodash';
import { createOrder } from '@libs/Ome';
import { Web3Context } from './Web3Context';
import { OrderState } from './OrderContext';
import Web3 from 'web3';
import { orderToOMEOrder, OrderData, signOrdersV3 } from '@tracer-protocol/tracer-utils';
import Tracer from '@libs/Tracer';
import { TransactionContext } from './TransactionContext';
import { defaults } from '@libs/Tracer';

interface ContextProps {
    tracerId: string | undefined;
    deposit: (amount: number, _callback?: () => void) => void;
    withdraw: (amount: number, _callback?: () => void) => void;
    setTracerId: (tracerId: string) => any;
    selectedTracer: Tracer | undefined;
    balance: UserBalance;
    placeOrder: (order: OrderState) => Promise<Result>;
}

export const TracerContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

type TracerState = {
    selectedTracer: Tracer | undefined;
    balance: UserBalance;
};

type StoreProps = {
    tracer?: string;
} & Children;

export const SelectedTracerStore: React.FC<StoreProps> = ({ tracer, children }: StoreProps) => {
    const { account, web3, config, networkId } = useContext(Web3Context);
    const { tracers } = useContext(FactoryContext);
    const { handleTransaction } = useContext(TransactionContext);

    const initialState: TracerState = {
        selectedTracer: undefined,
        balance: defaults.balances,
    };

    const reducer = (state: TracerState, action: Record<string, any>) => {
        switch (action.type) {
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
        // for initialising the tracer store through props
        if (tracer) {
            tracerDispatch({ type: 'setSelectedTracer', value: tracers?.[tracer] });
        }
    }, [tracer]);

    useEffect(() => {
        // detecting when tracers changes so we can set a default tracer
        if (tracers && !isEmpty(tracers)) {
            const defaultTracer = Object.values(tracers)[0];
            tracerDispatch({ type: 'setSelectedTracer', value: defaultTracer });
            // for testing purposes this will not be done each time someone opens the app
            // createBook(defaultTracer);
        }
    }, [tracers]);

    const { selectedTracer, balance } = tracerState;

    const fetchUserData = async () => {
        if (tracers) {
            const userData = await Promise.all(
                Object.values(tracers).map((tracer: Tracer) => tracer?.updateUserBalance(account)),
            );
            tracerDispatch({ type: 'setUserBalance', value: userData[0] });
        }
    };

    const placeOrder: (order: OrderState) => Promise<Result> = async (order) => {
        const { orderBase, price, position } = order;
        // all orders are OME orders
        const amount = Web3.utils.toWei(orderBase.toString()) ?? 0;
        const expiration = new Date().getTime() + 604800;
        const makes: OrderData[] = [
            {
                amount: amount,
                price: Web3.utils.toWei(price.toString()),
                side: position ? 1 : 0,
                maker: account ?? '',
                expires: expiration,
                market: selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer.address) : '',
                created: Date.now(),
            },
        ];
        try {
            const signedMakes = await signOrdersV3(web3, makes, config?.contracts.trader.address as string, networkId);
            const omeOrder = orderToOMEOrder(web3, await signedMakes[0]);
            const res = await createOrder(selectedTracer?.address as string, omeOrder);

            return res;
        } catch (err) {
            return { status: 'error', message: `Faiiled to place order ${err}` } as Result;
        }
    };

    const submit = async (deposit: boolean, amount: number, _callback?: () => any) => {
        const func = deposit ? selectedTracer.deposit : selectedTracer.withdraw;
        const callback = async (res: Result) => {
            if (res.status !== 'error') {
                const balance = await selectedTracer?.updateUserBalance(account);
                tracerDispatch({ type: 'setUserBalance', value: balance });
                _callback ? _callback() : null;
            }
        };
        handleTransaction
            ? handleTransaction(func, [amount, account], { callback })
            : console.error(`Failed to ${deposit ? 'deposit' : 'widthdraw'}: handleTransaction is undefined `);
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

    const tracerId = selectedTracer?.marketId;

    return (
        <TracerContext.Provider
            value={{
                tracerId,
                deposit: (amount, _callback) => submit(true, amount, _callback),
                withdraw: (amount, _callback) => submit(false, amount, _callback),
                setTracerId: (tracerId: string) =>
                    tracerDispatch({ type: 'setSelectedTracer', value: tracers?.[tracerId] }),
                selectedTracer,
                balance,
                placeOrder,
            }}
        >
            {children}
        </TracerContext.Provider>
    );
};
