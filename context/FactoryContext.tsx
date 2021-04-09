import React, { useEffect, useContext, useRef } from 'react';
import { useAllTracers } from '@hooks/GraphHooks/Tracer';
import { Children, Tracer } from 'types';
import { Web3Context } from './Web3Context';
import { Contract, Network } from '@lions-mane/web3-redux';
import { useDispatch } from 'react-redux';
import tracerJSON from '@tracer-protocol/contracts/build/contracts/Tracer.json';
import { AbiItem } from 'web3-utils';

import { useSelector } from 'react-redux';

type LabelledTracers = Record<string, Tracer>;
interface ContextProps {
    tracers: LabelledTracers;
}

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const reduxDispatch = useDispatch();
    const networks: (Network.Network | null)[] = useSelector(Network.selectMany);
    const { tracers } = useAllTracers();
    const { web3, networkId } = useContext(Web3Context);
    const factoryRef = useRef<LabelledTracers>({});

    useEffect(() => {
        let mounted = true;
        if (web3 && tracers.length) {
            if (mounted) {
                const labelledTracers: LabelledTracers = tracers.reduce(
                    (o: any, t: { marketId: string; id: string }) => ({
                        ...o,
                        [t.marketId]: {
                            address: t.id,
                            marketId: t.marketId,
                        },
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

    useEffect(() => {
        if (networks.length && tracers.length && networkId) {
            tracers.map((tracer: { id: string }) => {
                reduxDispatch(
                    Contract.create({
                        address: web3?.utils.toChecksumAddress(tracer.id) as string,
                        abi: tracerJSON.abi as AbiItem[],
                        networkId: networkId.toString(),
                    }),
                );
            });
        }
    }, [networks, tracers, networkId]);

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
