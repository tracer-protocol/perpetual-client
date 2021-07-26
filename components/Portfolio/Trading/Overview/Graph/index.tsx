import React, { FC } from 'react';
import styled from 'styled-components';
import { LineData } from 'libs/types/TracerTypes';
import LightWeightChart from '@components/Charts/LightWeightLineChart';
import { SmallTitle } from '@components/Portfolio';
import { useLines } from '@libs/Graph/hooks/Tracer';

const GraphContent = styled.div`
    position: relative;
    width: calc(100% + 48px);
    margin-left: -48px;
    height: calc(100% - 48px);
`;

interface GProps {
    className?: string;
    selectedTracerAddress: string;
    title?: string;
    background?: boolean;
    setPosition?: string;
    positionGraph?: boolean;
}
const Graph: FC<GProps> = styled(({ className, title, positionGraph, setPosition, selectedTracerAddress }: GProps) => {
    const { lines } = useLines(selectedTracerAddress);

    return (
        <figure className={className}>
            {title && <SmallTitle>{title}</SmallTitle>}
            <GraphContent>
                {/* Hide the series for Position graphs but not for the Profit and Loss graph */}
                <LightWeightChart
                    historyData={lines as LineData}
                    positionGraph={positionGraph as boolean}
                    setPosition={setPosition as string}
                />
            </GraphContent>
        </figure>
    );
})`
    width: 100%;
    height: ${(props: GProps) => (props.positionGraph ? '100%' : 'auto')};
    overflow: hidden;
    border-radius: 7px;
    padding: ${(props) => (props.positionGraph ? '0' : '16px')};
    position: relative;
    background: ${(props) => (props.background ? '#002886' : 'transparent')};

    h2 {
        margin-bottom: 0.5rem;
    }
`;

export default Graph;
