import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
// import { useCandles } from '@libs/Graph/hooks/Tracer';
import FogOverlay from '@components/Overlay/FogOverlay';
import TVChartContainer from '@components/Charts/AdvancedTrading';
import { TracerContext } from '@context/TracerContext';
import { OrderContext } from '@context/OrderContext';

const GraphContent = styled.div`
    height: 45vh;
    width: 100%;
`;

interface GProps {
    className?: string;
}
const Graph: FC<GProps> = styled(({ className }: GProps) => {
    // const { candles } = useCandles(selectedTracerAddress);
    const { selectedTracer } = useContext(TracerContext);
    const { order } = useContext(OrderContext);
    const [showOverlay, setOverlay] = useState(true);
    return (
        <div className={className}>
            <GraphContent>
                <TVChartContainer />
            </GraphContent>
            {showOverlay ? (
                <FogOverlay
                    buttonName="Show Chart"
                    onClick={() => setOverlay(false)}
                    show={!!order?.exposureBN.toNumber() || !!selectedTracer?.getBalance()?.quote.eq(0)}
                />
            ) : null}
        </div>
    );
})`
    position: relative;
`;

export default Graph;
