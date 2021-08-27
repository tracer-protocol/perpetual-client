import { Bar, LibrarySymbolInfo, ResolutionString } from '@public/static/charting_library/charting_library';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Web3 from 'web3';

const API_URL = 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-kovan';
// for testing
// const API_URL = 'https://min-api.cryptocompare.com';

const client = new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache(),
});

const history: Record<string, any> = {};

const pricesQuery = `
    query Candles($tracer: String!, $to: Int!) {
		fairPriceCandles(where: { period: 300, tracer: $tracer, time_lt: $to }, orderBy: time, orderDirection: asc) {
			id
			time
			open
			close
			low
			high
		}
    }
`;

export default {
    history: history,

    getBars: async (
        symbolInfo: LibrarySymbolInfo,
        _resolution: ResolutionString,
        to: number,
        from: number,
        first: boolean,
    ) => {
        console.debug(`Fetching candles from: ${from}, to: ${to}`, symbolInfo);
        // const splitSymbol = symbolInfo.name.split('/');
        // const url = new URL(
        //     `${API_URL}${
        //         resolution === 'D'
        //             ? '/data/histoday'
        //             : parseInt(resolution) >= 60
        //             ? '/data/histohour'
        //             : '/data/histominute'
        //     }`,
        // );

        // const qs: Record<string, any> = {
        //     e: 'Coinbase',
        //     fsym: splitSymbol[0],
        //     tsym: splitSymbol[1],
        //     toTs: to ? to : '',
        //     allData: true,
        //     limit: 2000,
        // };
        // Object.keys(qs).forEach((key) => url.searchParams.append(key, qs[key]));

        // return fetch(url.toString())
        //     .then((data) => data.json())
        //     .then((data) => {
        //         if (data.Response && data.Response === 'Error') {
        //             console.error('CryptoCompare API error:', data.Message);
        //             return [];
        //         }
        //         if (data.Data.length) {
        //             console.debug(
        //                 `Actually returned: ${new Date(data.TimeFrom * 1000).toLocaleDateString()} - ${new Date(
        //                     data.TimeTo * 1000,
        //                 ).toLocaleDateString()}`,
        //             );
        //             const bars = data.Data.map((el: any) => {
        //                 return {
        //                     time: el.time * 1000, //TradingView requires bar time in ms
        //                     low: el.low,
        //                     high: el.high,
        //                     open: el.open,
        //                     close: el.close,
        //                     volume: el.volumefrom,
        //                 };
        //             });
        //             if (first) {
        //                 const lastBar = bars[bars.length - 1];
        //                 history[symbolInfo.name] = { lastBar: lastBar };
        //             }
        //             return bars;
        //         } else {
        //             return [];
        //         }
        //     });

        return client
            .query({
                query: gql(pricesQuery),
                variables: {
                    tracer: symbolInfo.full_name.split(':')[0].toLowerCase(),
                    to: to,
                },
            })
            .then((data) => {
                if (data.error) {
                    console.error('Subgraph API error:', data.error);
                    return [];
                }
                if (data.data.fairPriceCandles?.length) {
                    const bars = data.data.fairPriceCandles.map(
                        (el: { time: number; low: string; high: string; open: string; close: string }) => {
                            return {
                                time: el.time * 1000, //TradingView requires bar time in ms
                                low: parseInt(Web3.utils.fromWei(el.low)),
                                high: parseInt(Web3.utils.fromWei(el.high)),
                                open: parseInt(Web3.utils.fromWei(el.open)),
                                close: parseInt(Web3.utils.fromWei(el.close)),
                                // volume: Web3.utils.fromWei(el.volume),
                            };
                        },
                    );
                    if (first) {
                        const lastBar = bars[bars.length - 1];
                        history[symbolInfo.name] = { lastBar: lastBar };
                    }
                    return bars;
                } else {
                    return [];
                }
            });
    },
} as {
    history: any;
    getBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        to: number,
        _from: number,
        first: boolean,
    ) => Promise<Bar[]>;
};
