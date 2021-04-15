import React, { useEffect, useContext, useRef } from 'react';
import { useAllTracers } from '@hooks/GraphHooks/Tracer';
import { Children } from 'types';
import Tracer from '@libs/Tracer'
import { Web3Context } from './Web3Context';

type LabelledTracers = Record<string, Tracer>;
interface ContextProps {
    tracers: LabelledTracers;
}

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { tracers } = useAllTracers();
    const { web3 } = useContext(Web3Context);
    const factoryRef = useRef<LabelledTracers>({});

    useEffect(() => {
        let mounted = true;
        if (web3 && tracers.length) {
            if (mounted) {
                const labelledTracers: LabelledTracers = tracers.reduce(
                    (o: any, t: { marketId: string; id: string }) => ({
                        ...o,
                        [t.marketId]: new Tracer(web3, t.id, t.marketId)
                    }),
                    {},
                );
                factoryRef.current = labelledTracers;
            }
            return () => {
                // cleanup
                mounted = false;
            };
        }
    }, [web3, tracers]);

    return (
        <FactoryContext.Provider
            value={{
                tracers: factoryRef.current,
            }}
        >
            {children}
        </FactoryContext.Provider>
    );
};
