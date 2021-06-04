import React, { useContext, useEffect, useReducer } from 'react';
import { FactoryContext } from './FactoryContext';
import { Children, Result, UserBalance } from 'types';
import { createOrder } from '@libs/Ome';
import { Web3Context } from './Web3Context';
import { OrderState } from './OrderContext';
import Web3 from 'web3';
import { orderToOMEOrder, OrderData, signOrdersV4 } from '@tracer-protocol/tracer-utils';
import Tracer from '@libs/Tracer';
import { TransactionContext } from './TransactionContext';
import { defaults } from '@libs/Tracer';

interface ContextProps {
    tracerId: string | undefined;
    deposit: (amount: number, _callback?: () => void) => void;
    withdraw: (amount: number, _callback?: () => void) => void;
    setTracerId: (tracerId: string) => any;
    selectedTracer: Tracer | undefined;
    balances: UserBalance;
    placeOrder: (order: OrderState) => Promise<Result>;
}

export const TracerContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

type TracerState = {
    selectedTracer: Tracer | undefined;
    balances: UserBalance;
};

type StoreProps = {
    tracer?: string;
} & Children;

export const SelectedTracerStore: React.FC<StoreProps> = ({ tracer, children }: StoreProps) => {
    const { account, web3, config, networkId } = useContext(Web3Context);
    const { factoryState } = useContext(FactoryContext);
    const { handleTransaction } = useContext(TransactionContext);

    const initialState: TracerState = {
        selectedTracer: undefined,
        balances: defaults.balances,
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
        if (tracer && factoryState?.hasSetTracers) {
            tracerDispatch({ type: 'setSelectedTracer', value: factoryState?.tracers[tracer] });
        }
    }, [tracer, factoryState?.hasSetTracers]);

    useEffect(() => {
        // detecting when tracers changes so we can set a default tracer
        if (factoryState?.hasSetTracers) {
            const defaultTracer = Object.values(factoryState?.tracers)[0];
            tracerDispatch({ type: 'setSelectedTracer', value: defaultTracer });
            fetchUserData();
            // for testing purposes this will not be done each time someone opens the app
            // createBook(defaultTracer);
        }
    }, [factoryState?.hasSetTracers]);

    const { selectedTracer, balances } = tracerState;

    const fetchUserData = async () => {
        if (factoryState?.hasSetTracers) {
            const userData = await selectedTracer?.updateUserBalance(account);
            tracerDispatch({ type: 'setUserBalance', value: userData });
        }
    };

    const placeOrder: (order: OrderState) => Promise<Result> = async (order) => {
        const { amountToPay, price, position } = order;
        const amount = Web3.utils.toWei(amountToPay.toString()) ?? 0;
        const now = Math.floor(Date.now() / 1000); // timestamp in seconds
        const fourDays = 345600; // four days in seconds
        const makes: OrderData[] = [
            {
                amount: amount,
                price: Web3.utils.toWei(price.toString()),
                side: position ? 1 : 0,
                maker: account ?? '',
                expires: now + fourDays,
                market: selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer.address) : '',
                created: now,
            },
        ];
        try {
            const signedMakes = await signOrdersV4(web3, makes, config?.contracts.trader.address as string, networkId);
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
            if (account) {
                fetchUserData();
            }
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
                    tracerDispatch({ type: 'setSelectedTracer', value: factoryState?.tracers?.[tracerId] }),
                selectedTracer,
                balances,
                placeOrder,
            }}
        >
            {children}
        </TracerContext.Provider>
    );
};
