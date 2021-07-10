import React, { FC } from 'react';
import styled from 'styled-components';
import { HistoryData } from 'libs/types/TracerTypes';
import LightWeightChart from '@components/Charts/LightWeightLineChart';

const GraphContent = styled.div`
    position: relative;
    width: 100%;
    height: calc(100% - 20px);
    margin-bottom: 20px;
`;

const SmallTitle = styled.h2`
    font-size: var(--font-size-medium);
    letter-spacing: -0.4px;
    color: var(--color-text);
    margin-bottom: 0.5rem;
    flex-basis: 100%
    width: fit-content;
    white-space: nowrap;
`;

interface GProps {
    className?: string;
    selectedTracerAddress: string;
}
const Graph: FC<GProps> = styled(({ selectedTracerAddress, className }: GProps) => {
    const history = ([
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
    ]);
    return (
        <div className={className}>
            <SmallTitle>Profit and Loss</SmallTitle>
            <GraphContent>
                <LightWeightChart historyData={history as HistoryData} />
            </GraphContent>
        </div>
    );
})`
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 7px;
    padding: 10px;
    position: relative;
    background: #002886;
`;

export default Graph;
