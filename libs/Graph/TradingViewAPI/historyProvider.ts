import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Web3 from 'web3';

const APIURL = "http://localhost:8000/subgraphs/name/dospore/tracer-graph";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
});


const api_root = 'https://min-api.cryptocompare.com'

const history: Record<string, any> = {}

const pricesQuery = `
    query {
		fairPriceCandles(where: { period: 60}, orderBy: time, orderDirection: desc) {
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

    getBars: (symbolInfo, resolution, first) => {
		var split_symbol = symbolInfo.name.split(/[:/]/)
		// let url = new URL(`${api_root}${resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'}`)

		// const qs: Record<string, any> = {
		// 		e: split_symbol[0],
		// 		fsym: split_symbol[1],
		// 		tsym: split_symbol[2],
		// 		toTs: Date.now(),
		// 		limit: 2000
		// 	}
		// Object.keys(qs).forEach((key => url.searchParams.append(key, qs[key])))
		// console.log("fetching from", url.toString)
		console.log(history)
        return client.query({
			query: gql(pricesQuery),
		})
            .then((data) => {
				if (data.error) {
					console.error('Subgraph API error:', data.error)
					return []
				}
				console.log(data)
				if (data.data.fairPriceCandles?.length) {
					var bars = data.data.fairPriceCandles.map((el: {
							time: number; low: string; high: string; 
							open: string; close: string;
						}) => {
						return {
							time: el.time, //TradingView requires bar time in ms
							low: Web3.utils.fromWei(el.low),
							high: Web3.utils.fromWei(el.high),
							open: Web3.utils.fromWei(el.open),
							close: Web3.utils.fromWei(el.close),
							// volume: Web3.utils.fromWei(el.volume),
						}
					})
					console.log(bars, "Bars")
					if (first) {
						var lastBar = bars[bars.length - 1]
						history[symbolInfo.name] = {lastBar: lastBar}
					}
					return bars
				} else {
					return []
				}
			})
	}
}