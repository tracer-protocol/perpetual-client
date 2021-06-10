import styled from 'styled-components';
import { useCandles } from '@libs/Graph/hooks/Tracer';
import { CandleData } from 'types/TracerTypes';
import LightWeightChart from '@components/Charts/LightWeightChart';
const GraphWrap = styled.div`
    height: 50vh;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 20px;
    max-height: 50vh;
`;

export default () => {
    const { candles } = useCandles();
    return (
        <GraphWrap>
            <LightWeightChart candleData={candles as CandleData} />
        </GraphWrap>
    );
};