import { gql, useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
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
    const { addToast } = useToasts();

    const { data, error, loading, refetch } = useQuery(ALL_POOLS, {
        errorPolicy: 'all',
        onError: ({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                addToast(`Failed to fetch account data. ${error}`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            } 
            if (networkError) {
                addToast(`Failed to connect to the graph. ${networkError}`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
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
