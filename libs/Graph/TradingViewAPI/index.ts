import historyProvider from './historyProvider';
import {
    ChartingLibraryWidgetOptions,
    DatafeedConfiguration,
    IBasicDataFeed,
    ResolutionString,
    SeriesFormat,
    Timezone,
} from '@public/static/charting_library/charting_library';

const supportedResolutions: ResolutionString[] = ['1D' as ChartingLibraryWidgetOptions['interval']];

const config = {
    supported_resolutions: supportedResolutions,
};
const dataFeed: IBasicDataFeed = {
    onReady: (cb) => {
        console.debug('=====onReady running');
        setTimeout(() => cb(config as DatafeedConfiguration), 0);
    },

    searchSymbols: (_userInput, _exchange, _symbolType, _onResultReadyCallback) => {
        console.debug('====Search Symbols running');
    },

    resolveSymbol: (symbolName, onSymbolResolvedCallback, _onResolveErrorCallback) => {
        console.debug('======resolveSymbol running');
        console.debug('resolveSymbol:', { symbolName });
        const symbol_stub = {
            name: symbolName,
            full_name: symbolName,
            description: '',
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC' as Timezone,
            format: 'price' as SeriesFormat,
            ticker: symbolName,
            exchange: '',
            listed_exchange: '',
            minmov: 1,
            minmov2: 0,
            pricescale: 100000,
            supported_resolutions: supportedResolutions,
        };

        if (symbolName.split('/')[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
            symbol_stub.pricescale = 100;
        }
        setTimeout(function () {
            onSymbolResolvedCallback(symbol_stub);
            console.debug('Resolving that symbol....', symbol_stub);
        }, 0);
    },

    getBars: (symbolInfo, resolution, periodParams, onResult, onError) => {
        console.debug('=====getBars running');
        const { to, from, firstDataRequest } = periodParams;
        historyProvider
            .getBars(symbolInfo, resolution, to, from, firstDataRequest)
            .then((bars) => {
                console.log(bars, 'returned bars');
                // if (bars.length && bars.length > periodParams.countBack) {
                if (bars.length) {
                    onResult(bars, { noData: false });
                } else {
                    onResult([], { noData: true });
                }
            })
            .catch((err) => {
                console.error({ err }, 'Failure to fetch bars');
                onError(err);
            });
    },

    subscribeBars: (_symbolInfo, _resolution, _onRealtimeCallback, _subscribeUID, _onResetCacheNeededCallback) => {
        console.debug('=====subscribeBars runnning');
    },
    unsubscribeBars: (_subscriberUID) => {
        console.debug('=====unsubscribeBars running');
    },
};

export default dataFeed;
