import { gql, useQuery } from '@apollo/client';
import { FilledOrder } from 'libs/types/OrderTypes';
import { useEffect, useRef } from 'react';
import Web3 from 'web3';
import { CandleData, LineData } from 'libs/types/TracerTypes';
import { toBigNumbers } from '@libs/utils';
import { InsuranceTransactions } from '@libs/types/InsuranceTypes';

const ALL_TRACERS = gql`
    query {
        tracers(first: 2, orderBy: timestamp, orderDirection: desc) {
            id
            marketId
        }
    }
`;

type Tracers = {
    tracers: {
        id: string; // tracer address
        marketId: string; // tracer market ticker eg BTC/USDC
    }[];
    error: any;
    loading: any;
    refetch: any;
};
/**
 * Hook to fetch a list of Tracer addresses deployed by the factory
 * @returns a list of Tracer objects containing the marketId and id (tracerAddress)
 */
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
 * @returns a list of orders or an empty array
 */
export const useMostRecentMatched: (tracer: string) => {
    mostRecentTrades: FilledOrder[];
    error: any;
    loading: any;
    refetch: any;
} = (tracer) => {
    const ref = useRef<FilledOrder[]>([]);
    const { data, error, loading, refetch } = useQuery(TRACER_TRADES, {
        variables: { tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors) {
                graphQLErrors.map((err) => console.error(`Failed to fetch tracer data: ${err}`));
            }
        },
    });

    useEffect(() => {
        if (data?.trades) {
            ref.current = toBigNumbers(data?.trades);
        }
    }, [data?.trades]);

    return {
        mostRecentTrades: ref.current,
        error,
        loading,
        refetch,
    };
};

// fetches 15 minute candles 15*60 === 900
const ALL_CANDLES = gql`
    query Tracer_Candles($tracer: String) {
        candles(where: { period: 900, tracer: $tracer }, orderBy: time, orderDirection: asc) {
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

const parseCandles: (data: any) => CandleData = (data) => {
    const foundTimes: Record<number, boolean> = {};
    if (!data) {
        return [];
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
    const ref = useRef<CandleData>([]);
    const { data, error, loading, refetch } = useQuery(ALL_CANDLES, {
        variables: { tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors) {
                graphQLErrors.map((err) => console.error(`Failed to fetch candle trades: ${err}`));
            }
        },
    });

    useEffect(() => {
        if (data?.candles?.length > ref.current.length) {
            ref.current = parseCandles(data?.candles);
        }
    }, [data?.candles]);

    return {
        candles: ref.current,
        error,
        loading,
        refetch,
    };
};

const parseLines: (data: any) => LineData = (data) => {
    const foundTimes: Record<number, boolean> = {};
    if (!data) {
        return [];
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
            value: parseFloat(Web3.utils.fromWei(candle.close)),
        });
    }
    return parsedData;
};

export const useLines: (tracer: string) => {
    lines: LineData;
    error: any;
    loading: any;
    refetch: any;
} = (tracer) => {
    const ref = useRef<LineData>([]);
    const { data, error, loading, refetch } = useQuery(ALL_CANDLES, {
        variables: { tracer: tracer.toLowerCase() },
        errorPolicy: 'all',
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors) {
                graphQLErrors.map((err) => console.error(`Failed to fetch line trades: ${err}`));
            }
        },
    });

    useEffect(() => {
        if (data?.candles?.length > ref.current.length) {
            ref.current = parseLines(data?.candles);
        }
    }, [data?.candles]);

    return {
        lines: ref.current,
        error,
        loading,
        refetch,
    };
};

const ALL_INSURANCE_TRANSACTIONS = gql`
    query {
        insuranceTransactions(orderBy: timestamp, orderDirection: desc) {
            id
            tracer
            transactionType
            amount
            timestamp
        }
    }
`;
export const useAllInsuranceTransactions: () => InsuranceTransactions = () => {
    const ref = useRef([]);
    const { data, error, loading, refetch } = useQuery(ALL_INSURANCE_TRANSACTIONS, {
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors?.length) {
                graphQLErrors.map((err) => console.error(`Failed to fetch transaction data: ${err}`));
            }
        },
    });

    return {
        insuranceTransactions: data?.insuranceTransactions ?? ref.current,
        error,
        loading,
        refetch,
    };
};
