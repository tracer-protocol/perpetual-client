import React, { FC, useState } from 'react';
import styled from 'styled-components';
// import { useCandles } from '@libs/Graph/hooks/Tracer';
// import { CandleData } from 'libs/types/TracerTypes';
// import CandleStickChart from '@components/Charts/CandleStickChart';
import FogOverlay from '@components/Overlay/FogOverlay';
import TVChartContainer from '@components/Charts/AdvancedTrading';

const GraphContent = styled.div`
    height: 45vh;
    width: 100%;
`;

interface GProps {
    className?: string;
    selectedTracerAddress: string;
}
const Graph: FC<GProps> = styled(({ selectedTracerAddress, className }: GProps) => {
    // const { candles } = useCandles(selectedTracerAddress);
    console.log(selectedTracerAddress);
    const [showOverlay, setOverlay] = useState(true);
    return (
        <div className={className}>
            <GraphContent>
                <TVChartContainer />
                {/* <CandleStickChart candleData={candles as CandleData} /> */}
            </GraphContent>
            {showOverlay ? <FogOverlay buttonName="Show Chart" onClick={() => setOverlay(false)} /> : null}
        </div>
    );
})`
    position: relative;
`;

export default Graph;
