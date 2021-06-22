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
        trades(first: 15, where: { tracer: $tracer }, orderBy: timestamp, orderDirection: desc) {
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

// fetches 15 minute candles 15*60 === 900
const ALL_CANDLES = gql`
    query Tracer_Candles($tracer: String) {
        candles(where: { period: 900, tracer: $tracer }) {
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

const parseCandles: (data: any) => CandleData | undefined = (data) => {
    const foundTimes: Record<number, boolean> = {};
    if (!data) {
        return;
    }
    const parsedData = [];
    for (let i = 0; i < data?.length ?? 0; i++) {
        const candle = data[i];
        if (foundTimes[candle.time]) {
            continue;
        }
        if (i === 0) {
            continue;
        }
        foundTimes[candle.time] = true;
        parsedData.push({
            time: candle.time,
            open: parseFloat(Web3.utils.fromWei(candle.open)),
            close: parseFloat(Web3.utils.fromWei(candle.close)),
            low: parseFloat(Web3.utils.fromWei(candle.low)),
            high: parseFloat(Web3.utils.fromWei(candle.high)),
            totalAmount: parseFloat(Web3.utils.fromWei(candle.totalAmount)),
        });
    }
    return parsedData;
};

export const useCandles: (tracer: string) => {
    candles: CandleData;
    error: any;
    loading: any;
    refetch: any;
} = (tracer) => {
    const ref = useRef<[]>([]);
    const { data, error, loading, refetch } = useQuery(ALL_CANDLES, {
        variables: { tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors) {
                graphQLErrors.map((err) => console.error(`Failed to fetch candle trades: ${err}`));
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
