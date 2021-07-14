import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import Graph from '../Graph';
import { LargeButton } from '@components/Portfolio';
import { UserBalance } from '@libs/types/TracerTypes';
import { BigNumber } from 'bignumber.js';
import { OrderContext, orderDefaults } from '@context/OrderContext';
import Exposure from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Exposure';
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
    balances: UserBalance;
    baseTicker: string;
    fairPrice: BigNumber;
    quoteTicker: string;
}
const PositionGraph: FC<PGProps> = styled(
    ({ selectedTracerAddress, className, positionType, balances, fairPrice, quoteTicker, baseTicker }: PGProps) => {
        const [currency] = useState(0); // 0 quoted in base
        const { order } = useContext(OrderContext);

        return (
            <span className={className}>
                <PGContainer>
                    <TableBody>
                        <Row>
                            <HeadingCell>ETH-USDC</HeadingCell>
                            <HeadingCell className={positionType === 1 ? 'green' : 'red'}>
                                {positionType === 1 && 'SHORT'}
                                {positionType === 2 && 'LONG'}
                            </HeadingCell>
                        </Row>
                        <Row>
                            <InfoCell>
                                <Amount>
                                    <Exposure
                                        balances={balances}
                                        fairPrice={fairPrice}
                                        currency={currency}
                                        order={order ?? orderDefaults.order}
                                        quoteTicker={quoteTicker}
                                        baseTicker={baseTicker}
                                    />
                                </Amount>
                                <CellTitle>Exposure</CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>7.33 x</Amount>
                                <CellTitle>Leverage</CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>$42.45 (55%)</Amount>
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
                                <Amount>$43,234.42</Amount>
                                <CellTitle>
                                    <StatusDot type="status-orange" />
                                    Liquidation Price
                                </CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>$43,234.42</Amount>
                                <CellTitle>
                                    <StatusDot type="status-lightblue" />
                                    Break Even Price
                                </CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>$43,234.42</Amount>
                                <CellTitle>
                                    <StatusDot type="status-white" />
                                    Last Price
                                </CellTitle>
                            </InfoCell>
                        </Row>
                        <Row>
                            <BorderlessCell>
                                <LargeButton className="primary filled">Close Position</LargeButton>
                            </BorderlessCell>
                            <BorderlessCell inner>
                                <LargeButton className="primary">Adjust Position</LargeButton>
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
