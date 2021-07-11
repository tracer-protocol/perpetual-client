import React, { FC } from 'react';
import styled from 'styled-components';
import Graph from '../Graph';
import { Button } from '@components/Portfolio';
import {
    PGContainer,
    Row,
    HeadingCell,
    InfoCell,
    Amount, 
    CellTitle,
    StatusDot,
    CellNoBorder,
} from './PositionElements';

const largeButton = {
    height: '32px',
    width: '145px',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    hoverFG: '#fff',
    hoverBG: 'var(--color-primary)',
    hoverCursor: 'pointer',
};

const GraphContainer = styled.div`
    height: 150px;
    width: 100%;
    
    div {
        height: 100% !important;
        padding: 0;        
    }
`;

interface PGProps {
    className?: string;
    selectedTracerAddress: string;
    positionType: number;
}
const PositionGraph: FC<PGProps> = styled(({ selectedTracerAddress, className, positionType }: PGProps) => {
    return (
        <div className={className}>
            <PGContainer>
                <Row>
                    <HeadingCell>ETH-USDC</HeadingCell>
                    <HeadingCell className={positionType === 1 ? 'green' : 'red'}>
                        {positionType === 1 && 
                            'SHORT'
                        }
                        {positionType === 2 && 
                            'LONG'
                        }
                    </HeadingCell>
                </Row>
                <Row>
                    <InfoCell>
                        <Amount>4.2 ETH</Amount>
                        <CellTitle>Exposure</CellTitle>
                    </InfoCell>
                    <InfoCell>
                        <Amount>7.33 x</Amount>
                        <CellTitle>Leverage</CellTitle>
                    </InfoCell>
                    <InfoCell>
                        <Amount>$42.45 (55%)</Amount>
                        <CellTitle>Leverage</CellTitle>
                    </InfoCell>
                </Row>
                <Row>  
                    <GraphContainer>
                        <Graph className="positionGraph" selectedTracerAddress={selectedTracerAddress} />
                    </GraphContainer>
                </Row>
                <Row>
                    <InfoCell>
                        <Amount>$43,234.42</Amount>
                        <CellTitle><StatusDot type="status-lightblue"></StatusDot>Liquidation Price</CellTitle>
                    </InfoCell>
                    <InfoCell>
                        <Amount>$43,234.42</Amount>
                        <CellTitle><StatusDot type="status-orange"></StatusDot>Break Even Price</CellTitle>
                    </InfoCell>
                    <InfoCell>
                        <Amount>$43,234.42</Amount>
                        <CellTitle><StatusDot type="status-white"></StatusDot>Current Price</CellTitle>
                    </InfoCell>
                </Row>
                <Row>
                    <CellNoBorder>
                        <Button className="primary" theme={largeButton}>
                            Close Position
                        </Button>
                    </CellNoBorder>
                    <CellNoBorder>
                        <Button theme={largeButton}>
                            Adjust Position
                        </Button>
                    </CellNoBorder>
                </Row>
            </PGContainer>
        </div>
    );
})`
    position: relative;
    width: 425px;
    min-width: 425px;
    height: 380px;
    overflow: hidden;
    border-radius: 7px;
    background: #00125D;
    margin: 0px 7.5px;
`;

export default PositionGraph;
