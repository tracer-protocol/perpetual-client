// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { LibrarySymbolInfo, ResolutionString } from '@public/static/charting_library/charting_library';
// import Web3 from 'web3';

// const API_URL = "http://localhost:8000/subgraphs/name/dospore/tracer-graph";
// for testing
const API_URL = 'https://min-api.cryptocompare.com';

// const client = new ApolloClient({
//   uri: API_URL,
//   cache: new InMemoryCache()
// });

const history: Record<string, any> = {};

// const pricesQuery = `
//     query {
// 		fairPriceCandles(where: { period: 60}, orderBy: time, orderDirection: desc) {
// 			id
// 			time
// 			open
// 			close
// 			low
// 			high
// 		}
//     }
// `;

export default {
    history: history,

    getBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        to: number,
        _from: number,
        first: boolean,
    ) => {
        const split_symbol = symbolInfo.name.split('/');
        const url = new URL(
            `${API_URL}${
                resolution === 'D'
                    ? '/data/histoday'
                    : parseInt(resolution) >= 60
                    ? '/data/histohour'
                    : '/data/histominute'
            }`,
        );

        const qs: Record<string, any> = {
            e: 'Coinbase',
            fsym: split_symbol[0],
            tsym: split_symbol[1],
            toTs: to ? to : '',
            allData: true,
            limit: 2000,
        };
        Object.keys(qs).forEach((key) => url.searchParams.append(key, qs[key]));

        return fetch(url.toString())
            .then((data) => data.json())
            .then((data) => {
                if (data.Response && data.Response === 'Error') {
                    console.error('CryptoCompare API error:', data.Message);
                    return [];
                }
                if (data.Data.length) {
                    console.debug(
                        `Actually returned: ${new Date(data.TimeFrom * 1000).toLocaleDateString()} - ${new Date(
                            data.TimeTo * 1000,
                        ).toLocaleDateString()}`,
                    );
                    const bars = data.Data.map((el: any) => {
                        return {
                            time: el.time * 1000, //TradingView requires bar time in ms
                            low: el.low,
                            high: el.high,
                            open: el.open,
                            close: el.close,
                            volume: el.volumefrom,
                        };
                    });
                    if (first) {
                        const lastBar = bars[bars.length - 1];
                        history[symbolInfo.name] = { lastBar: lastBar };
                    }
                    return bars;
                } else {
                    return [];
                }
            });

        // return client.query({
        // 	query: gql(pricesQuery),
        // })
        //     .then((data) => {
        // 		if (data.error) {
        // 			console.error('Subgraph API error:', data.error)
        // 			return []
        // 		}
        // 		console.log(data)
        // 		if (data.data.fairPriceCandles?.length) {
        // 			var bars = data.data.fairPriceCandles.map((el: {
        // 					time: number; low: string; high: string;
        // 					open: string; close: string;
        // 				}) => {
        // 				return {
        // 					time: el.time, //TradingView requires bar time in ms
        // 					low: Web3.utils.fromWei(el.low),
        // 					high: Web3.utils.fromWei(el.high),
        // 					open: Web3.utils.fromWei(el.open),
        // 					close: Web3.utils.fromWei(el.close),
        // 					// volume: Web3.utils.fromWei(el.volume),
        // 				}
        // 			})
        // 			console.log(bars, "Bars")
        // 			if (first) {
        // 				var lastBar = bars[bars.length - 1]
        // 				history[symbolInfo.name] = {lastBar: lastBar}
        // 			}
        // 			return bars
        // 		} else {
        // 			return []
        // 		}
        // 	})
    },
};
