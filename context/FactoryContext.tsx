import React, { useEffect, useContext, useReducer } from 'react';
import { useAllTracers } from '@libs/Graph/hooks/Tracer';
import { Children } from 'types';
import Tracer from '@libs/Tracer';
import { Web3Context } from './Web3Context';
import { useAllUsersMatched } from '@libs/Graph/hooks/Account';
import { LabelledOrders } from 'types/OrderTypes';
import { LabelledTracers } from 'types/TracerTypes';
interface ContextProps {
    allFilledOrders: LabelledOrders;
    factoryState: FactoryState;
}

export type FactoryState = {
    tracers: LabelledTracers;
    hasSetTracers: boolean;
};
export const initialFactoryState: FactoryState = {
    tracers: {},
    hasSetTracers: false,
};
export type FactoryAction =
    | { type: 'setLoaded'; marketId: string }
    | { type: 'setTracers'; tracers: LabelledTracers }
    | { type: 'HAS_SET_TRACERS' }
    | { type: 'setMarket'; value: string };

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { web3, account } = useContext(Web3Context);
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
                    hasSetTracers: true,
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
                const _labelledTracers: LabelledTracers = tracers.reduce(
                    (o: any, t: { marketId: string; id: string }) => ({
                        ...o,
                        [t.marketId]: {
                            ...new Tracer(web3, t.id, t.marketId),
                            loading: true,
                        },
                    }),
                    {},
                );
                Promise.all(Object.values(_labelledTracers).map((tracer) => tracer.initialised))
                .then((_res) => {
                    factoryDispatch({
                        type: 'setTracers',
                        tracers: _labelledTracers,
                    });
                    factoryDispatch({
                        type: 'HAS_SET_TRACERS'
                    })
                })
            }
            return () => {
                // cleanup
                mounted = false;
            };
        }
    }, [web3, tracers]);

    const fetchAllBalances = async () => {
        Object.values(factoryState.tracers).map((tracer) => {
            tracer
                ?.updateUserBalance(account)
                .then((_res) => {
                    factoryDispatch({ type: 'setLoaded', marketId: tracer.marketId });
                })
                .catch((err) => {
                    console.error(`Failed to fetch balances for ${tracer.marketId}`, err);
                });
        });
    };

    useEffect(() => {
        // update users balance across all tracers
        if (account && factoryState.hasSetTracers) {
            fetchAllBalances();
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
