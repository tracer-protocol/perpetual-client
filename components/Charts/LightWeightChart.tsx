import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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
                    color: '#37B1F6'
                },
                horzLine: {
                    color: '#37B1F6'
                }
            },
            priceScale: {
                borderColor: '#37B1F6',
                position: 'left'
            },
            // @ts-ignore
            timeScale: {
                borderColor: '#37B1F6',
            },
            layout: {
                textColor: '#696969',
                fontFamily: 'Akkurat',
                backgroundColor: '#03065E',
            },
        },
        candlestickSeries: [
            {
                data: [
                    { time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85 },
                    { time: '2018-10-22', open: 180.82, high: 181.4, low: 177.56, close: 178.75 },
                    { time: '2018-10-23', open: 175.77, high: 179.49, low: 175.44, close: 178.53 },
                    { time: '2018-10-24', open: 178.58, high: 182.37, low: 176.31, close: 176.97 },
                    { time: '2018-10-25', open: 177.52, high: 180.5, low: 176.83, close: 179.07 },
                    { time: '2018-10-26', open: 176.88, high: 177.34, low: 170.91, close: 172.23 },
                    { time: '2018-10-29', open: 173.74, high: 175.99, low: 170.95, close: 173.2 },
                    { time: '2018-10-30', open: 173.16, high: 176.43, low: 172.64, close: 176.24 },
                    { time: '2018-10-31', open: 177.98, high: 178.85, low: 175.59, close: 175.88 },
                    { time: '2018-11-01', open: 176.84, high: 180.86, low: 175.9, close: 180.46 },
                    { time: '2018-11-02', open: 182.47, high: 183.01, low: 177.39, close: 179.93 },
                    { time: '2018-11-05', open: 181.02, high: 182.41, low: 179.3, close: 182.19 },
                ],
            },
        ],
    };
    return data;
};

const LightWeightChart: React.FC = () => {
    const [graphData, setGraphData] = useState<Record<string, unknown>>();

    useEffect(() => {
        //TODO: Fetch data
        setGraphData(setGraphOptions());
    }, []);

    if (!graphData) {
        return <p>Loading...</p>;
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
