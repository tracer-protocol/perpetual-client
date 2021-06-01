import { getUsersOrders } from '@libs/Ome';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import React, { useContext, useEffect, useReducer } from 'react';
import { Children } from 'types';
import { TracerContext } from './TracerContext';
import { Web3Context } from './Web3Context';

interface ContextProps {
    omeState: OMEState
    omeDispatch: React.Dispatch<OMEAction>
}

type OMEState = {
    userOrders: OMEOrder[]
}

type OMEAction =
    | { type: 'setUserOrders'; orders: OMEOrder[] }
    | { type: 'updateUserOrders' }

export const OMEContext = React.createContext<Partial<ContextProps>>({});

export const OMEStore : React.FC<Children> = ({ children }: Children) => {
    const { account } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);

    const initialState: OMEState = {
        userOrders: []
    };

    const reducer = (state: OMEState, action: OMEAction ) => {
        switch (action.type) {
            case 'setUserOrders':
                return { ...state, userOrders: action.orders};
            case 'updateUserOrders': {
                fetchUserData();
                return { ...state }
            }
            default:
                throw new Error('Unexpected action');
        }
    };

    const [omeState, omeDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetchUserData()
        }
        return () => {
            mounted = false; // cleanup
        };
    }, [selectedTracer, account])

    const fetchUserData = async () => {
        if (selectedTracer?.address && account) {
            const res = await getUsersOrders(selectedTracer?.address as string, account);
            omeDispatch({ type: 'setUserOrders', orders: res})
        }
    };

    return (
        <OMEContext.Provider
            value={{
                omeDispatch,
                omeState
            }}
        >
            {children}
        </OMEContext.Provider>
    );
};
