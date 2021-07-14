import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useCandles } from '@libs/Graph/hooks/Tracer';
import { CandleData } from 'libs/types/TracerTypes';
import CandleStickChart from '@components/Charts/CandleStickChart';
import FogOverlay from '@components/Overlay/FogOverlay';

const GraphContent = styled.div`
    height: 45vh;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 20px;
`;

interface GProps {
    className?: string;
    selectedTracerAddress: string;
}
const Graph: FC<GProps> = styled(({ selectedTracerAddress, className }: GProps) => {
    const { candles } = useCandles(selectedTracerAddress);
    const [showOverlay, setOverlay] = useState(true);
    return (
        <div className={className}>
            <GraphContent>
                <CandleStickChart candleData={candles as CandleData} />
            </GraphContent>
            {showOverlay ? <FogOverlay buttonName="Show Chart" onClick={() => setOverlay(false)} /> : null}
        </div>
    );
})`
    position: relative;
`;

export default Graph;
