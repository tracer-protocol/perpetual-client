import { gql, useQuery } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { useCallback, useRef } from 'react';
import { FilledOrder, LabelledOrders } from 'types/OrderTypes';
import Web3 from 'web3';
import { toBigNumbers } from '..';

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
    query Tracer_Trades($account: String, $tracer: String) {
        trades(where: { trader: $account, tracer: $tracer }) {
            position
            amount
            price
            timestamp
            trader {
                id
            }
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
        filledOrders: data?.trades ? toBigNumbers(data?.trades) : ref.current,
        error,
        loading,
        refetch,
    };
};

const USER_TRADES = gql`
    query Tracer_Trades($account: String!) {
        trades(where: { trader: $account }, orderBy: timestamp, orderDirection: desc) {
            position
            amount
            price
            timestamp
            tracer {
                id
            }
        }
    }
`;

const groupTracers = (filledOrders: any[]) =>
    filledOrders.reduce((r, a) => {
        r[a.tracer.id] = r[a.tracer.id] || [];
        r[a.tracer.id].push({
            ...a,
            amount: new BigNumber(Web3.utils.fromWei(a.amount)),
            price: new BigNumber(Web3.utils.fromWei(a.price)),
        });
        return r;
    }, Object.create(null));

export const useAllUsersMatched: (account: string) => {
    allFilledOrders: LabelledOrders;
    error: any;
    loading: any;
    refetch: any;
} = (account) => {
    const ref = useRef<LabelledOrders>({});
    const { data, error, loading, refetch } = useQuery(USER_TRADES, {
        variables: { account: account?.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch account trades: ${err}`));
            }
        },
    });

    const memoedGroupTracers = useCallback(
        () => (data?.trades ? groupTracers(data?.trades) : ref.current),
        [data?.trades],
    );

    return {
        allFilledOrders: memoedGroupTracers(),
        error,
        loading,
        refetch,
    };
};
