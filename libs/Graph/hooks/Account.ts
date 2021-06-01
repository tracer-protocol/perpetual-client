import { gql, useQuery } from '@apollo/client';
import { useRef } from 'react';
import { FilledOrder } from 'types/OrderTypes';

const ALL_TRACERS = gql`
    query TracerData($user: String!) {
        trader(id: $user) {
            id
            trades(first: 200, orderBy: timestamp, orderDirection: desc) {
                id
                timestamp
                amount
                order {
                    price
                    priceMultiplier
                    tracer {
                        marketId
                    }
                }
                position
            }
        }
    }
`;

export const useAccountData: (user: string | undefined) => any = (user) => {
    // eslint-disable-line
    const ref = useRef([]);
    const { data, error, loading, refetch } = useQuery(ALL_TRACERS, {
        variables: { user: user?.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch account data: ${err}`));
            }
        },
    });

    return {
        userData: data || ref.current,
        error,
        loading,
        refetch,
    };
};

const USER_TRACER_TRADES = gql`
    query Tracer_Trades($account: String!, $tracer: String!) {
        trades(trader: $account, tracer: $tracer) {
            position
            amount
            price
            timestamp
        }
    }
`;

export const useUsersMatched: (
    tracer: string,
    account: string,
) => {
    filledOrders: FilledOrder[];
    error: any;
    loading: any;
    refetch: any;
} = (tracer, account) => {
    const ref = useRef<FilledOrder[]>([]);
    const { data, error, loading, refetch } = useQuery(USER_TRACER_TRADES, {
        variables: { account: account?.toLowerCase(), tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch account trades: ${err}`));
            }
        },
    });

    return {
        filledOrders: data?.trades || ref.current,
        error,
        loading,
        refetch,
    };
};
