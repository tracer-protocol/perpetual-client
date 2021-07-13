import React, { FC } from 'react';
import styled from 'styled-components';
import { HistoryData } from 'libs/types/TracerTypes';
import LightWeightChart from '@components/Charts/LightWeightLineChart';
import { SmallTitle } from '@components/Portfolio';

const GraphContent = styled.div`
    position: relative;
    width: calc(100% + 48px);
    margin-left: -48px;
    height: calc(100% - 48px);
    margin-top: 0.5rem;
`;

interface GProps {
    className?: string;
    selectedTracerAddress: string;
    title?: string;
    background?: boolean;
    setPosition?: string;
    positionGraph?: boolean;
}
const Graph: FC<GProps> = styled(({ className, title, positionGraph, setPosition }: GProps) => {
    const history = [
        { time: '2021-06-11', value: 80.01 },
        { time: '2021-06-12', value: 96.63 },
        { time: '2021-06-13', value: 106.64 },
        { time: '2021-06-14', value: 121.89 },
        { time: '2021-06-15', value: 114.43 },
        { time: '2021-06-16', value: 104.01 },
        { time: '2021-06-17', value: 96.63 },
        { time: '2021-06-18', value: 76.64 },
        { time: '2021-06-19', value: 81.89 },
        { time: '2021-06-20', value: 104.43 },
        { time: '2021-06-21', value: 94.01 },
        { time: '2021-06-22', value: 106.63 },
        { time: '2021-06-23', value: 116.64 },
        { time: '2021-06-24', value: 121.89 },
        { time: '2021-06-25', value: 124.43 },
        { time: '2021-06-26', value: 130.01 },
        { time: '2021-06-27', value: 136.63 },
        { time: '2021-06-28', value: 146.64 },
        { time: '2021-06-29', value: 141.89 },
        { time: '2021-06-30', value: 154.43 },
    ];
    return (
        <figure className={className}>
            {title && <SmallTitle>{title}</SmallTitle>}
            <GraphContent>
                {/* Hide the series for Position graphs but not for the Profit and Loss graph */}
                <LightWeightChart
                    historyData={history as HistoryData}
                    positionGraph={positionGraph as boolean}
                    setPosition={setPosition as string}
                />
            </GraphContent>
        </figure>
    );
})`
    width: 100%;
    height: ${(props) => (props.positionGraph ? '100%' : 'auto')};
    overflow: hidden;
    border-radius: 7px;
    padding: ${(props) => (props.positionGraph ? '0' : '16px')};
    position: relative;
    background: ${(props) => (props.background ? '#002886' : 'transparent')};
`;

export default Graph;
