import historyProvider from './historyProvider';
import {
    ChartingLibraryWidgetOptions,
    DatafeedConfiguration,
    IBasicDataFeed,
    ResolutionString,
    SeriesFormat,
    Timezone,
} from '@public/static/charting_library/charting_library';

const supportedResolutions: ResolutionString[] = [
    // these work if you set it as default but seem to fail when changing
    // '5' as ChartingLibraryWidgetOptions['interval'],
    '1D' as ChartingLibraryWidgetOptions['interval'],
];

const config = {
    supported_resolutions: [...supportedResolutions],
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
        const marketId = symbolName.split(':')[1];
        const symbolStub = {
            name: marketId,
            full_name: symbolName,
            description: marketId,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC' as Timezone,
            format: 'price' as SeriesFormat,
            ticker: marketId,
            exchange: '',
            listed_exchange: '',
            minmov: 1,
            minmov2: 0,
            pricescale: 100000,
            has_intraday: true,
            supported_resolutions: supportedResolutions,
        };

        if (marketId.split('/')[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
            symbolStub.pricescale = 100;
        }
        setTimeout(function () {
            onSymbolResolvedCallback(symbolStub);
            console.debug('Resolving that symbol....', symbolStub);
        }, 0);
    },

    getBars: (symbolInfo, resolution, periodParams, onResult, onError) => {
        console.debug('=====getBars running');
        const { to, from, firstDataRequest, countBack } = periodParams;
        console.debug(`Requires ${countBack} results to succeed for resolution ${resolution}`);
        historyProvider
            .getBars(symbolInfo, resolution, to, from, firstDataRequest)
            .then((bars) => {
                console.debug('Returned bars', bars);
                if (bars.length) {
                    onResult(bars, { noData: false });
                } else {
                    onResult([], { noData: true });
                }
            })
            .catch((err) => {
                console.error('Failure to fetch bars', { err });
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
