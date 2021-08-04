import React, { useEffect, useReducer } from 'react';
import { useAllTracers } from '@libs/Graph/hooks/Tracer';
import { Children } from 'libs/types';
import Tracer from '@libs/Tracer';
import { useAllUsersMatched } from '@libs/Graph/hooks/Account';
import { LabelledOrders } from 'libs/types/OrderTypes';
import { LabelledTracers } from 'libs/types/TracerTypes';
import { useWeb3 } from './Web3Context/Web3Context';
interface ContextProps {
    allFilledOrders: LabelledOrders;
    factoryState: FactoryState;
}

export type FactoryState = {
    tracers: LabelledTracers;
    hasSetTracers: boolean;
    loading: boolean;
};
export const initialFactoryState: FactoryState = {
    tracers: {},
    hasSetTracers: false,
    loading: true,
};
export type FactoryAction =
    | { type: 'setLoaded'; marketId: string }
    | { type: 'setTracers'; tracers: LabelledTracers }
    | { type: 'clearTracers' }
    | { type: 'HAS_SET_TRACERS'; value: boolean }
    | { type: 'setMarket'; value: string }
    | { type: 'setLoading'; tracer: string; value: boolean };

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the FactoryContext.
 * Initiates a list of Tracer classes upon receiving a list of tracer addresses.
 * Has a holistic reference to all Tracers.
 * TODO allow adding an removing of Tracers based on a given Tracer contract addresses
 */
export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { web3, account } = useWeb3();
    const { tracers } = useAllTracers();

    const reducer = (state: FactoryState, action: FactoryAction) => {
        switch (action.type) {
            case 'setLoaded':
                return {
                    ...state,
                    tracers: {
                        ...state.tracers,
                        [action.marketId]: {
                            ...state.tracers[action.marketId],
                            loading: false,
                        },
                    },
                };
            case 'setTracers':
                return {
                    ...state,
                    tracers: action.tracers,
                };
            case 'HAS_SET_TRACERS': {
                return {
                    ...state,
                    hasSetTracers: action.value,
                };
            }
            case 'clearTracers': {
                return {
                    ...state,
                    tracers: {},
                    hasSetTracers: false,
                };
            }
            case 'setLoading': {
                const currentTracer = state.tracers[action.tracer];
                if (!currentTracer) {
                    return {
                        ...state,
                    };
                }
                return {
                    ...state,
                    tracers: {
                        ...state.tracers,
                        [action.tracer]: {
                            ...currentTracer,
                            loading: action.value,
                        },
                    },
                };
            }
            default:
                throw new Error('Unexpected action');
        }
    };

    const [factoryState, factoryDispatch] = useReducer(reducer, initialFactoryState);
    const { allFilledOrders } = useAllUsersMatched(account ?? '');

    useEffect(() => {
        let mounted = true;
        if (web3 && tracers.length) {
            if (mounted) {
                factoryDispatch({
                    type: 'clearTracers',
                });
                const _labelledTracers: LabelledTracers = tracers.reduce(
                    (o: any, t: { marketId: string; id: string }) => ({
                        ...o,
                        [t.id]: {
                            ...new Tracer(web3, t.id, t.marketId),
                            loading: false,
                        },
                    }),
                    {},
                );
                Promise.all(Object.values(_labelledTracers).map((tracer) => tracer.initialised)).then((_res) => {
                    factoryDispatch({
                        type: 'setTracers',
                        tracers: _labelledTracers,
                    });
                    factoryDispatch({
                        type: 'HAS_SET_TRACERS',
                        value: true,
                    });
                });
            }
            return () => {
                // cleanup
                mounted = false;
            };
        } else {
            factoryDispatch({
                type: 'clearTracers',
            });
        }
    }, [web3, tracers]);

    /** Fetches all tracer user tracer data */
    const fetchAllUserData = () => {
        Object.values(factoryState.tracers).map((tracer) => fetchUserData(tracer));
    };

    /** Fetches and sets individual tracer data */
    const fetchUserData = async (tracer: Tracer) => {
        factoryDispatch({
            type: 'setLoading',
            tracer: tracer.marketId,
            value: true,
        });
        const userBalance = await tracer?.updateUserBalance(account);
        console.debug(`${tracer.marketId} user balance`, userBalance);
        factoryDispatch({
            type: 'setLoading',
            tracer: tracer.marketId,
            value: false,
        });
    };

    useEffect(() => {
        if (account && factoryState.hasSetTracers) {
            fetchAllUserData();
        }
    }, [account, factoryState.hasSetTracers]);

    return (
        <FactoryContext.Provider
            value={{
                allFilledOrders: allFilledOrders,
                factoryState,
            }}
        >
            {children}
        </FactoryContext.Provider>
    );
};
