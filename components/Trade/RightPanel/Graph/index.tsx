import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
// import { useCandles } from '@libs/Graph/hooks/Tracer';
import FogOverlay from '@components/Overlay/FogOverlay';
import TVChartContainer from '@components/Charts/AdvancedTrading';
import { TracerContext } from '@context/TracerContext';

const GraphContent = styled.div`
    height: 45vh;
    width: 100%;
`;

interface GProps {
    className?: string;
}
const Graph: FC<GProps> = styled(({ className }: GProps) => {
    const { selectedTracer } = useContext(TracerContext);
    // const { candles } = useCandles(selectedTracerAddress);
    const [showOverlay, setOverlay] = useState(true);
    return (
        <div className={className}>
            <GraphContent>
                <TVChartContainer
                    selectedTracer={{
                        address: selectedTracer?.address,
                        marketId: selectedTracer?.marketId,
                    }}
                />
            </GraphContent>
            {showOverlay ? <FogOverlay buttonName="Show Chart" onClick={() => setOverlay(false)} /> : null}
        </div>
    );
})`
    position: relative;
`;

export default Graph;
