import { gql, useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { InsurancePool } from 'types';

const ALL_POOLS = gql`
    query InsuranceData {
        insurancePools {
            id
            asset
            tracer {
                id
                marketId
            }
            holders(orderBy: amount, orderDirection: desc) {
                id
                trader {
                    id
                }
                timestamp
                amount
            }
            liquidity
            target
        }
    }
`;

type Pools = {
    insurancePools: Record<string, InsurancePool>;
    error: any;
    loading: any;
    refetch: any;
};

export const useAllPools: () => Pools = () => {
    const ref = useRef({});

    const { data, error, loading, refetch } = useQuery(ALL_POOLS, {
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch insurance data: ${err}`));
            }
        },
    });

    const [parsed, setParsed] = useState({});

    useEffect(() => {
        setParsed(
            // creates an object mapping the poolID to the rest of the data
            data?.insurancePools.reduce(
                (o: any, pool: any) => ({
                    ...o,
                    [pool?.tracer.marketId]: {
                        id: pool.id,
                        asset: pool.asset,
                        holders: pool.holders,
                        liquidity: parseFloat(pool.liquidity),
                        target: parseFloat(pool.target),
                        tracer: pool.tracer,
                    },
                }),
                {},
            ) || ref.current,
        );
    }, [data]);

    return {
        insurancePools: parsed,
        error,
        loading,
        refetch,
    };
};
