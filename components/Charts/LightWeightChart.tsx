import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { CandleData } from 'types/TracerTypes';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

const ChartWrapper = dynamic(import('./LightWeightWrapper'), { ssr: false });
// @ts-ignore
// @ts-nocheck
const setGraphOptions: () => Record<string, unknown> = () => {
    const data: Record<string, unknown> = {
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
    return data;
};

const SLoadingOutlined = styled(LoadingOutlined)`
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
`;

const LightWeightChart: React.FC<{ candleData: CandleData }> = ({ candleData }) => {
    const [graphData, setGraphData] = useState<Record<string, unknown>>();
    useEffect(() => {
        //TODO: Fetch data
        setGraphData({
            ...setGraphOptions(),
            candlestickSeries: [
                {
                    data: candleData,
                },
            ],
        });
    }, []);

    useMemo(() => {
        if (candleData.length) {
            setGraphData({
                ...setGraphOptions(),
                candlestickSeries: [
                    {
                        data: candleData,
                    },
                ],
            });
        } else {
            setGraphData({
                ...setGraphOptions(),
            });
        }
    }, [candleData]);

    if (!graphData || !(graphData?.candlestickSeries as any[])?.length) {
        return <SLoadingOutlined />;
    } else {
        return (
            <ChartWrapper
                options={graphData.options as Record<string, unknown>}
                from={'2018-10-19'}
                to={'2018-11-05'}
                candlestickSeries={graphData.candlestickSeries as any[]}
                autoWidth
                autoHeight
            />
        );
    }
};

export default LightWeightChart;
