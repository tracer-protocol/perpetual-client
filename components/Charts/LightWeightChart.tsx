import React, { FC, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CandleData, LineData } from 'libs/types/TracerTypes';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';

const ChartWrapper = dynamic(import('./LightWeightWrapper'), { ssr: false });

const chartData = {
    options: {
        alignLabels: true,
        timeScale: {
            rightOffset: 1,
            barSpacing: 3,
            fixLeftEdge: true,
            lockVisibleTimeRangeOnResize: true,
            rightBarStaysOnScroll: true,
            borderVisible: false,
            borderColor: '#0C3586',
            visible: true,
            timeVisible: true,
            secondsVisible: false,
            autoScale: true,
        },
        grid: {
            vertLines: {
                color: 'rgba(12, 53, 134, 1)',
                style: 1,
                visible: true,
            },
            horzLines: {
                color: 'rgba(12, 53, 134, 1)',
                style: 1,
                visible: true,
            },
        },
        crosshair: {
            vertLine: {
                color: '#37B1F6',
            },
            horzLine: {
                color: '#37B1F6',
            },
        },
        priceScale: {
            borderColor: '#37B1F6',
            position: 'left',
        },
        // @ts-ignore
        timeScale: {
            borderColor: '#37B1F6',
        },
        layout: {
            textColor: '#696969',
            fontFamily: 'Akkurat',
            backgroundColor: '#000240',
        },
    },
};

const StyledIcon = styled(Icon)`
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    height: 32px;
`;

interface LWCProps {
    graphType?: string;
    candleData?: CandleData;
    lineData?: LineData;
}
const LightWeightChart: FC<LWCProps> = ({ candleData, lineData, graphType }: LWCProps) => {
    const [graphData, setGraphData] = useState<Record<string, unknown>>();
    const hasReset = useRef<boolean>(false);

    useMemo(() => {
        if (candleData?.length) {
            setGraphData({
                ...chartData,
                candlestickSeries: [
                    {
                        data: candleData,
                    },
                ],
                lineSeries: [
                    {
                        data: lineData,
                    },
                ],
            });
            hasReset.current = false;
        } else if (lineData?.length) {
            setGraphData({
                ...chartData,
                lineSeries: [
                    {
                        data: lineData,
                    },
                ],
            });
            hasReset.current = false;
        } else {
            if (!hasReset.current) {
                setGraphData(chartData);
                hasReset.current = true;
            }
        }
    }, [candleData || lineData]);

    const now = Math.floor(Date.now() / 1000); // timestamp in seconds
    const twoHour = 2 * 60 * 60; // two hours in seconds

    switch (graphType) {
        case 'candle-graph':
            if (!graphData || !(graphData?.candlestickSeries as any[])?.length) {
                return <StyledIcon component={TracerLoading} className="tracer-loading" />;
            } else {
                return (
                    <ChartWrapper
                        options={graphData.options as Record<string, unknown>}
                        from={now + twoHour}
                        to={now - twoHour}
                        candlestickSeries={graphData.candlestickSeries as any[]}
                        autoWidth
                        autoHeight
                    />
                );
            }

        default:
            if (!graphData || !(graphData?.lineSeries as any[])?.length) {
                return <StyledIcon component={TracerLoading} className="tracer-loading" />;
            } else {
                return (
                    <ChartWrapper
                        options={graphData.options as Record<string, unknown>}
                        from={now + twoHour}
                        to={now - twoHour}
                        lineSeries={graphData.lineSeries as any[]}
                        autoWidth
                        autoHeight
                    />
                );
            }
    }
};

export default LightWeightChart;
