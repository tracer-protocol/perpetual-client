import { gql, useQuery } from '@apollo/client';
import { FilledOrder } from 'types/OrderTypes';
import { useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import Web3 from 'web3';
import { CandleData } from 'types/TracerTypes';
import { toBigNumbers } from '..';

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
    const { data, error, loading, refetch } = useQuery(ALL_TRACERS, {
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors?.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch tracer data: ${err}`));
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
`;

/**
 * Fetch the most recent X trades for the tracer market
 * @param tracer market
 * @returns
 */
export const useMostRecentMatched: (tracer: string) => {
    mostRecentTrades: FilledOrder[];
    error: any;
    loading: any;
    refetch: any;
} = (tracer) => {
    const ref = useRef<FilledOrder[]>([]);
    const { addToast } = useToasts();
    const { data, error, loading, refetch } = useQuery(TRACER_TRADES, {
        variables: { tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map((err) => console.error(`Failed to fetch tracer data: ${err}`));
            }
            if (networkError) {
                addToast(['Failed to fetch', `Failed to fetch account trades due to network error: ${networkError}`], {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        },
    });

    return {
        mostRecentTrades: data?.trades ? toBigNumbers(data?.trades) : ref.current,
        error,
        loading,
        refetch,
    };
};
const ALL_CANDLES = gql`
    query {
        candles(where: { period: 3600 }) {
            id
            time
            open
            close
            low
            high
            totalAmount
        }
    }
`;

const parseCandles: (data: any) => CandleData = (data) =>
    data?.map((candle: any) => ({
        time: candle.time,
        open: parseFloat(Web3.utils.fromWei(candle.open)),
        close: parseFloat(Web3.utils.fromWei(candle.close)),
        low: parseFloat(Web3.utils.fromWei(candle.low)),
        high: parseFloat(Web3.utils.fromWei(candle.high)),
        totalAmount: parseFloat(Web3.utils.fromWei(candle.totalAmount)),
    }));

export const useCandles: () => {
    candles: CandleData;
    error: any;
    loading: any;
    refetch: any;
} = () => {
    const ref = useRef<[]>([]);
    const { addToast } = useToasts();
    const { data, error, loading, refetch } = useQuery(ALL_CANDLES, {
        errorPolicy: 'all',
        onError: ({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map((err) => console.error(`Failed to fetch candle trades: ${err}`));
            }
            if (networkError) {
                addToast(['Failed to fetch', `Failed to connect to the graph. ${networkError}`], {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        },
    });

    return {
        candles: parseCandles(data?.candles) || ref.current,
        error,
        loading,
        refetch,
    };
};
