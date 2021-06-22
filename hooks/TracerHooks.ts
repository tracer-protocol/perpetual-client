import { useEffect, useState, useContext } from 'react';
import { FactoryContext, initialFactoryState } from '@context/FactoryContext';

/**
 * Function which gets all available market pairs from the tracer factory.
 * Returns a mapping from the of string keys to an array of strings.
 * The key value will be the asset providing collateral and the array of strings
 *  will be all relative tracer markets.
 */
export const useMarketPairs: () => Record<string, string[]> = () => {
    const [marketPairs, setMarketPairs] = useState<Record<string, string[]>>({});
    const { factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    useEffect(() => {
        if (tracers) {
            const pairs: Record<string, string[]> = {};
            for (const key of Object.keys(tracers)) {
                const pair: string[] = key.split('/');
                if (pairs[pair[1]]) {
                    pairs[pair[1]].push(pair[0]);
                } else {
                    pairs[pair[1]] = [pair[0]];
                }
            }
            setMarketPairs(pairs);
        }
    }, [tracers]);

    return marketPairs;
};