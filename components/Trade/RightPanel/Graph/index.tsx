import React, { FC, useState } from 'react';
import styled from 'styled-components';
// import { useCandles } from '@libs/Graph/hooks/Tracer';
import FogOverlay from '@components/Overlay/FogOverlay';
import TVChartContainer from '@components/Charts/AdvancedTrading';

const GraphContent = styled.div`
    height: 45vh;
    width: 100%;
`;

interface GProps {
    className?: string;
}
const Graph: FC<GProps> = styled(({ className }: GProps) => {
    // const { candles } = useCandles(selectedTracerAddress);
    const [showOverlay, setOverlay] = useState(true);
    return (
        <div className={className}>
            <GraphContent>
                <TVChartContainer />
            </GraphContent>
            {showOverlay ? <FogOverlay buttonName="Show Chart" onClick={() => setOverlay(false)} /> : null}
        </div>
    );
})`
    position: relative;
`;

export default Graph;
