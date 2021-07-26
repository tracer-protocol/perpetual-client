import React, { FC } from 'react';
import styled from 'styled-components';
import Graph from '../Graph';
import { UserBalance } from '@libs/types/TracerTypes';
import { BigNumber } from 'bignumber.js';
import {
    PGContainer,
    TableBody,
    Row,
    HeadingCell,
    InfoCell,
    Amount,
    CellTitle,
    StatusDot,
    BorderlessCell,
} from './PositionElements';
import { useLines } from '@libs/Graph/hooks/Tracer';
import { toApproxCurrency } from '@libs/utils';
import { calcLiquidationPrice } from '@tracer-protocol/tracer-utils';
import { Button } from '@components/General';

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
    base: BigNumber;
    balances: UserBalance;
    market: string;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
}
const PositionGraph: FC<PGProps> = styled(
    ({ selectedTracerAddress, className, base, balances, market, fairPrice, maxLeverage }: PGProps) => {
        const { lines } = useLines(selectedTracerAddress);

        // TODO: Need to define positions in context
        const closePosition = async (_e: any) => {
            console.log('Create position function not found');
        };

        return (
            <span className={className}>
                <PGContainer>
                    <TableBody>
                        <Row>
                            <HeadingCell>{market}</HeadingCell>
                            <HeadingCell className={base.lt(0) ? 'green' : 'red'}>
                                {base.lt(0) && 'SHORT'}
                                {base.lt(0) && 'LONG'}
                            </HeadingCell>
                        </Row>
                        <Row>
                            <InfoCell>
                                <Amount>-</Amount>
                                <CellTitle>Exposure</CellTitle>
                            </InfoCell>
                            <InfoCell>
                                <Amount>-</Amount>
                                <CellTitle>Leverage</CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>-</Amount>
                                <CellTitle>Available Margin</CellTitle>
                            </InfoCell>
                        </Row>
                        <Row>
                            <GraphContainer>
                                <Graph
                                    className="positionGraph"
                                    selectedTracerAddress={selectedTracerAddress}
                                    setPosition="none"
                                    positionGraph
                                />
                            </GraphContainer>
                        </Row>
                        <Row>
                            <InfoCell>
                                <Amount>
                                    {!base.eq(0)
                                        ? toApproxCurrency(
                                              calcLiquidationPrice(
                                                  balances.quote,
                                                  balances.base,
                                                  fairPrice,
                                                  maxLeverage,
                                              ),
                                          )
                                        : '-'}
                                </Amount>
                                <CellTitle>
                                    <StatusDot type="status-orange" />
                                    Liquidation Price
                                </CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>-</Amount>
                                <CellTitle>
                                    <StatusDot type="status-lightblue" />
                                    Break Even Price
                                </CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>
                                    {lines.length !== 0 ? toApproxCurrency(lines[lines.length - 1]?.value) : '-'}
                                </Amount>
                                <CellTitle>
                                    <StatusDot type="status-white" />
                                    Last Price
                                </CellTitle>
                            </InfoCell>
                        </Row>
                        <Row>
                            <BorderlessCell>
                                <Button className="primary" onClick={closePosition}>
                                    Close Position
                                </Button>
                            </BorderlessCell>
                            <BorderlessCell inner>
                                <Button className="primary">Adjust Position</Button>
                            </BorderlessCell>
                        </Row>
                    </TableBody>
                </PGContainer>
            </span>
        );
    },
)`
    position: relative;
    width: 430px;
    min-width: 430px;
    overflow: hidden;
    border-radius: 7px;
    background: #00125d;
    margin: 0 8px;
`;

export default PositionGraph;
