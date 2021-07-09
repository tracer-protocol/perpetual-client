import React from 'react';
import styled from 'styled-components';
import { useCandles } from '@libs/Graph/hooks/Tracer';
import { CandleData } from 'libs/types/TracerTypes';
import LightWeightChart from '@components/Charts/LightWeightChart';

const GraphWrap = styled.div`
    height: 45vh;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 20px;
    position: relative;
`;

export default (({ selectedTracerAddress }: { selectedTracerAddress: string }) => {
    const { candles } = useCandles(selectedTracerAddress);
    return (
        <GraphWrap>
            <LightWeightChart candleData={candles as CandleData} graphType="candle-graph" />
        </GraphWrap>
    );
}) as React.FC<{ selectedTracerAddress: string }>;
