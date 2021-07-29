import { gql, useQuery } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { useCallback, useRef } from 'react';
import { FilledOrder, LabelledOrders } from 'libs/types/OrderTypes';
import { MarginTransaction } from 'libs/types/TracerTypes';
import Web3 from 'web3';
import { toBigNumbers } from 'libs/utils/converters';

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

/**
 * Fetches all Tracer trades made by a given user
 * @param user target user
 */
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
        trades(where: { trader: $account, tracer: $tracer }, orderBy: timestamp, orderDirection: desc) {
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

/**
 * Fetches a list of matched orders for a given user and Tracer
 * @param tracer market
 * @param account target user
 * @returns a list of orders that the user has made and have been matched on chain
 */
export const useUsersMatched: (
    tracer: string,
    account: string,
) => {
    filledOrders: FilledOrder[];
    error: any;
    loading: any;
    refetchFilledOrders: (...args: any) => any;
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
        refetchFilledOrders: refetch,
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

/**
 * Fetchs all the users matched orders not specific to a given Tracer
 * @param account target user
 * @returns all user matched orders on chain
 */
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

const USER_MARGIN_TRANSACTIONS = gql`
    query Margin_Transactions($account: String) {
        marginTransactions(where: { trader: $account }, orderBy: timestamp, orderDirection: desc) {
            id
            timestamp
            amount
            transactionType
            tracer {
                marketId
            }
        }
    }
`;

/**
 * Fetches a list of matched orders for a given user and Tracer
 * @param tracer market
 * @param account target user
 * @returns a list of orders that the user has made and have been matched on chain
 */
export const useAllMarginTransactions: (account: string) => {
    marginTransactions: MarginTransaction[];
    error: any;
    loading: any;
    refetchTransactions: (...args: any) => any;
} = (account) => {
    const ref = useRef<MarginTransaction[]>([]);
    const { data, error, loading, refetch } = useQuery(USER_MARGIN_TRANSACTIONS, {
        variables: { account: account?.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch account transactions: ${err}`));
            }
        },
    });

    return {
        marginTransactions: data?.marginTransactions ? data?.marginTransactions : ref.current,
        error,
        loading,
        refetchTransactions: refetch,
    };
};
