import { gql, useQuery } from '@apollo/client';
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
        errorPolicy: 'all',
        onError: (error) => {
            addToast(`Failed to fetch tracers. ${error}`, {
                appearance: 'error',
                autoDismiss: true,
            });
        },
    });

    return {
        tracers: data?.tracers || ref.current,
        error,
        loading,
        refetch,
    };
};
