import React, { useEffect, useContext, useState } from 'react';
import { useAllTracers } from '@hooks/GraphHooks/Tracer';
import { Children } from 'types';
import Tracer from '@libs/Tracer';
import { Web3Context } from './Web3Context';

type LabelledTracers = Record<string, Tracer>;
interface ContextProps {
    tracers: LabelledTracers;
}

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { tracers } = useAllTracers();
    const { web3 } = useContext(Web3Context);
    const [labelledTracers, setLabelledTracers] = useState<LabelledTracers>({});

    useEffect(() => {
        let mounted = true;
        if (web3 && tracers.length) {
            if (mounted) {
                const _labelledTracers: LabelledTracers = tracers.reduce(
                    (o: any, t: { marketId: string; id: string }) => ({
                        ...o,
                        [t.marketId]: new Tracer(web3, t.id, t.marketId),
                    }),
                    {},
                );
                setLabelledTracers(_labelledTracers);
                // factoryRef.current = labelledTracers;
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
                tracers: labelledTracers,
            }}
        >
            {children}
        </FactoryContext.Provider>
    );
};
