import React, { FC, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { LineData } from '@libs/types/TracerTypes';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from '@public/img/logos/tracer/tracer_loading.svg';

const ChartWrapper = dynamic(import('../'), { ssr: false });

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
            visible: true,
            timeVisible: true,
            secondsVisible: false,
            autoScale: true,
            borderColor: '#37B1F6',
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

const liquidationPrice = {
    price: 50,
    color: '#F15025',
    lineWidth: 2,
};

interface LWCProps {
    lineData?: LineData | undefined;
}
const PriceLineChart: FC<LWCProps> = ({ lineData }: LWCProps) => {
    const [graphData, setGraphData] = useState<Record<string, unknown>>();
    const hasReset = useRef<boolean>(false);

    useMemo(() => {
        if (lineData?.length) {
            setGraphData({
                ...chartData,
                lineSeries: [
                    {
                        data: lineData,
                        priceLines: [liquidationPrice],
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
    }, [lineData]);

    const now = Math.floor(Date.now() / 1000); // timestamp in seconds
    const twoHour = 2 * 60 * 60; // two hours in seconds

    if (!graphData || !(graphData?.lineSeries as any[])?.length) {
        return <StyledIcon component={TracerLoading} className="tracer-loading" />;
    } else {
        return (
            <ChartWrapper
                options={graphData.options as Record<string, unknown>}
                from={now}
                to={now + twoHour}
                lineSeries={graphData.lineSeries as any[]}
                autoWidth
                autoHeight
            />
        );
    }
};

export default PriceLineChart;
