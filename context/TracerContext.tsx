import React, { useContext, useEffect, useReducer } from 'react';
import { FactoryContext } from './FactoryContext';
import { Children, Result, TakenOrder, Tracer, TracerInfo } from 'types';
import { useTracer } from '@components/hooks/TracerHooks';
import { isEmpty } from 'lodash';
import { createBook } from '@libs/Ome';

interface ContextProps {
    tracerId: string | undefined;
    setTracerId: (tracerId: string) => any;
    selectedTracer: Tracer | undefined;
    tracerInfo: TracerInfo;
    quoteAsset: string | undefined;
    baseAsset: string | undefined;
    takeOrders: (orders: TakenOrder[]) => Promise<Result>;
    makeOrder: (amount: number, price: number, side: boolean) => Promise<Result>;
}

export const TracerContext = React.createContext<Partial<ContextProps>>({});

type TracerState = {
    tracerId: string;
    selectedTracer: Tracer | undefined;
    tracerInfo: TracerInfo;
};

type StoreProps = {
    tracer?: string;
} & Children;

export const SelectedTracerStore: React.FC<StoreProps> = ({ tracer, children }: StoreProps) => {
    const { tracers } = useContext(FactoryContext);

    const initialState: TracerState = {
        tracerId: tracer || 'TEST0/USD',
        selectedTracer: undefined,
        tracerInfo: {
            balance: {
                margin: 0,
                position: 0,
                deposited: 0,
                totalLeveragedValue: 0,
                lastUpdatedGasPrice: 0,
                walletBalance: 0,
            },
            priceMultiplier: 0,
            oraclePrice: 0,
            tracerBaseToken: '',
            baseTokenBalance: 0,
            fundingRate: 0,
            matchingFee: 0,
        },
    };

    const reducer = (state: TracerState, action: Record<string, any>) => {
        switch (action.type) {
            case 'setTracerId':
                return { ...state, tracerId: action.value };
            case 'setSelectedTracer':
                return { ...state, selectedTracer: action.value };
            case 'setUserBalance':
                return { ...state, userBalance: action.value };
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

    const { tracerId, selectedTracer } = tracerState;

    const { makeOrder, takeOrders, ...tracerInfo } = useTracer(selectedTracer?.address);

    const [quoteAsset, baseAsset] = tracerId.split('/');

    return (
        <TracerContext.Provider
            value={{
                tracerId,
                setTracerId: (tracerId: string) => tracerDispatch({ type: 'setTracerId', value: tracerId }),
                selectedTracer,
                quoteAsset,
                baseAsset,
                tracerInfo: tracerInfo as TracerInfo,
                makeOrder,
                takeOrders,
            }}
        >
            {children}
        </TracerContext.Provider>
    );
};
