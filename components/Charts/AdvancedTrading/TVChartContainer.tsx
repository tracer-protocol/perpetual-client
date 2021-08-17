import * as React from 'react';
import styles from './index.module.css';

import {
    widget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    IChartingLibraryWidget,
    ResolutionString,
} from '@public/static/charting_library';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
import DataFeed from '@libs/Graph/TradingViewAPI';
export interface ChartContainerProps {
    symbol: ChartingLibraryWidgetOptions['symbol'];
    interval: ChartingLibraryWidgetOptions['interval'];

    // BEWARE: no trailing slash is expected in feed URL
    datafeedUrl: string;
    libraryPath: ChartingLibraryWidgetOptions['library_path'];
    chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
    chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
    clientId: ChartingLibraryWidgetOptions['client_id'];
    userId: ChartingLibraryWidgetOptions['user_id'];
    fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
    autosize: ChartingLibraryWidgetOptions['autosize'];
    studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
    containerId: ChartingLibraryWidgetOptions['container_id'];
}

export interface ChartContainerState {
    showChart: boolean;
}

function getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export default class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>, ChartContainerState> {
    public static defaultProps: ChartContainerProps = {
        symbol: 'Coinbase:BTC/USD',
        interval: '5D' as ResolutionString,
        containerId: 'tv_chart_container',
        datafeedUrl: 'https://demo_feed.tradingview.com',
        libraryPath: '/static/charting_library/',
        chartsStorageUrl: 'https://saveload.tradingview.com',
        chartsStorageApiVersion: '1.1',
        clientId: 'tradingview.com',
        userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    };
    constructor(props: ChartContainerProps) {
        super(props);
        this.state = { showChart: false };
        this.setShowChart = this.setShowChart.bind(this);
    }

    public setShowChart(): void {
        this.setState({ showChart: true });
    }

    private tvWidget: IChartingLibraryWidget | null = null;

    public componentDidMount(): void {
        console.log(this.props.interval)
        // @ts-ignore
        const widgetOptions: ChartingLibraryWidgetOptions = {
            debug: false,
            symbol: this.props.symbol as string,
            datafeed: DataFeed,
            // new UDFCompatibleDatafeed(this.props.datafeedUrl),
            interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
            container_id: this.props.containerId as ChartingLibraryWidgetOptions['container_id'],
            library_path: this.props.libraryPath as string,
            locale: getLanguageFromURL() || 'en',
            disabled_features: [
                'use_localstorage_for_settings', 
                'save_chart_properties_to_local_storage', 
                'header_symbol_search',
                'timeframes_toolbar',
                'go_to_date'
            ],
            enabled_features: [],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            timeframe: '1M',
            overrides: {
                'paneProperties.backgroundType': 'solid',
                'paneProperties.background': '#000240',
                'scalesProperties.lineColor': '#3da8f5',
                'scalesProperties.textColor': '#fff',
                'scalesProperties.backgroundColor': '#000240',
                'paneProperties.backgroundGradientStartColor': '#000240',
                'paneProperties.backgroundGradientEndColor': '#000240',
            },
            loading_screen: {
                backgroundColor: '#000240!important',
                foregroundColor: '#000240!important',
            },
            toolbar_bg: '#000240',
            autosize: this.props.autosize,
            custom_css_url: '/styles/chartStyles.css',
            studies_overrides: this.props.studiesOverrides,
        };

        const tvWidget = new widget(widgetOptions);
        this.tvWidget = tvWidget;

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute('title', 'Click to show a notification popup');
                button.classList.add('apply-common-tooltip');
                button.addEventListener('click', () =>
                    tvWidget.showNoticeDialog({
                        title: 'Notification',
                        body: 'TradingView Charting Library API works correctly',
                        callback: () => {
                            console.log('Noticed!');
                        },
                    }),
                );
                button.innerHTML = 'Check API';
            });
            tvWidget.activeChart().setVisibleRange(
                { from: Date.now() - 60000, to: Date.now() },
            ).then(() => console.log('New visible range is applied'));
            this.setShowChart();
        });
    }

    public componentWillUnmount(): void {
        if (this.tvWidget !== null) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
    }

    public render(): JSX.Element {
        console.log(this.state);
        return (
            <>
                <div id={this.props.containerId} className={styles.TVChartContainer} />
                {/* {!this.state.showChart ? <Loading component={TracerLoading} className="tracer-loading" /> : null} */}
            </>
        );
    }
}

const Loading = styled(Icon)`
    position: absolute;
    background: var(--color-background);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    svg {
        margin: auto;
    }
`;
