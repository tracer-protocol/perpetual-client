import React, { useEffect, useContext, useState, useMemo } from 'react';
import { useAllTracers } from '@libs/Graph/hooks/Tracer';
import { Children } from 'types';
import Tracer from '@libs/Tracer';
import { Web3Context } from './Web3Context';
import { useAllUsersMatched } from '@libs/Graph/hooks/Account';
import { LabelledOrders } from 'types/OrderTypes';
import { LabelledTracers } from 'types/TracerTypes';
interface ContextProps {
    tracers: LabelledTracers;
    allFilledOrders: LabelledOrders;
}

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { web3, account } = useContext(Web3Context);
    const { tracers } = useAllTracers();
    const [labelledTracers, setLabelledTracers] = useState<LabelledTracers>({});
    const { allFilledOrders } = useAllUsersMatched(account ?? '');

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

    useMemo(() => { // update users balance across all tracers
        if (tracers && account) {
            Object.values(labelledTracers).map((tracer) => tracer.updateUserBalance(account))
        }
    }, [account, labelledTracers])

    return (
        <FactoryContext.Provider
            value={{
                tracers: labelledTracers,
                allFilledOrders: allFilledOrders
            }}
        >
            {children}
        </FactoryContext.Provider>
    );
};
