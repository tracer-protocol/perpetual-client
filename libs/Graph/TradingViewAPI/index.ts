import historyProvider from './historyProvider'
import { DatafeedConfiguration, IBasicDataFeed, LibrarySymbolInfo, ResolutionString, SeriesFormat, Timezone } from "@public/static/charting_library/charting_library"

const supportedResolutions: ResolutionString[] = ["1D" as any]

const config = {
    supported_resolutions: supportedResolutions
}; 
const dataFeed: IBasicDataFeed = {
	onReady: (cb) => {
		console.log('=====onReady running')	
		setTimeout(() => cb(config as DatafeedConfiguration), 0)
	},

	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		console.log('====Search Symbols running')
	},

	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		// expects a symbolInfo object in response
		console.log('======resolveSymbol running')
		// console.log('resolveSymbol:',{symbolName})
		var split_data = symbolName.split(/[:/]/)
		// console.log({split_data})
		var symbol_stub = {
			name: symbolName,
			full_name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC' as Timezone,
			format: 'price' as SeriesFormat,
			ticker: symbolName,
			exchange: split_data[0],
			listed_exchange: split_data[0],
			minmov: 1,
			pricescale: 1000000,
			supported_resolutions:  supportedResolutions,
		}

		// if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
		// 	symbol_stub.pricescale = 100
		// }
		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		
		
		// onResolveErrorCallback('Not feeling it today')

	},
	getBars: (
		symbolInfo, resolution, periodParams,
		onResult,
		onError
	) => {
		console.log('=====getBars running')
		console.log(periodParams, "Here")
		// console.log('function args',arguments)
		// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		historyProvider.getBars(symbolInfo, resolution, periodParams.firstDataRequest)
		.then(bars => {
			console.log(bars, "returned bars")
			if (bars.length && bars.length > periodParams.countBack) {
				onResult(bars, {noData: false})
			} else {
				onResult([], {noData: true})
			}
		}).catch(err => {
			console.log({err}, "Failure bitches")
			onError(err)
		})

	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		console.log('=====subscribeBars runnning')
	},
	unsubscribeBars: subscriberUID => {
		console.log('=====unsubscribeBars running')
	},
}

export default dataFeed;