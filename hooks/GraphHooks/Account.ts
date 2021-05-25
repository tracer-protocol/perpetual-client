import { useToasts } from 'react-toast-notifications';
import { gql, useQuery } from '@apollo/client';
import { useRef } from 'react';

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

export const useAccountData: (user: string | undefined) => any = (user) => { // eslint-disable-line
    const ref = useRef([]);
    const { addToast } = useToasts();
    const { data, error, loading, refetch } = useQuery(ALL_TRACERS, {
        variables: { user: user?.toLowerCase() },
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

    return {
        userData: data || ref.current,
        error,
        loading,
        refetch,
    };
};
