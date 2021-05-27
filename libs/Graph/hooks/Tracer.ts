import { gql, useQuery } from '@apollo/client';
import { FilledOrder } from 'types/OrderTypes';
import { useRef } from 'react';
import { useToasts } from 'react-toast-notifications';

const ALL_TRACERS = gql`
    query {
        tracers {
            id
            marketId
        }
    }
`;

type Tracers = {
    tracers: {
        id: string;
        marketId: string;
    }[];
    error: any;
    loading: any;
    refetch: any;
};

export const useAllTracers: () => Tracers = () => {
    const ref = useRef([]);
    const { addToast } = useToasts();
    const { data, error, loading, refetch } = useQuery(ALL_TRACERS, {
        onError: ({ graphQLErrors, networkError }) => {
            if (graphQLErrors?.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch tracer data: ${err}`));
            }
            if (networkError) {
                addToast(`Failed to fetch tracer data: ${networkError}`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        },
    });

    return {
        tracers: data?.tracers ?? ref.current,
        error,
        loading,
        refetch,
    };
};


const TRACER_TRADES = gql`
    query Tracer_Trades($tracer: String!) {
        trades(first: 15, tracer: $tracer, orderBy: timestamp, orderDirection: desc) {
            position
            amount
            price
            timestamp
        }
    }
`

/**
 * Fetch the most recent X trades for the tracer market
 * @param tracer market
 * @returns 
 */
export const useMostRecentMatched = (tracer: string) => {
    const ref = useRef<FilledOrder[]>([]);
    const { addToast } = useToasts();
    const { data, error, loading, refetch } = useQuery(TRACER_TRADES, {
        variables: { tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                addToast(`Failed to fetch account trades. ${error}`, {
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

    return {
        mostRecentTrades: data || ref.current,
        error,
        loading,
        refetch,
    };
}
