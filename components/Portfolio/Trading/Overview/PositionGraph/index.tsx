import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import Graph from '../Graph';
import { LargeButton } from '@components/Portfolio';
import { UserBalance } from '@libs/types/TracerTypes';
import { BigNumber } from 'bignumber.js';
import { OrderContext, orderDefaults } from '@context/OrderContext';
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
import Exposure from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Exposure';
import Leverage from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Leverage';
import { AvailableMargin } from '@components/Trade/Advanced/TradingPanel/Account';
import { useLines } from '@libs/Graph/hooks/Tracer';
import { toApproxCurrency } from '@libs/utils';
import { calcLiquidationPrice } from '@tracer-protocol/tracer-utils';

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
    maxLeverage: BigNumber;
    quoteTicker: string;
}
const PositionGraph: FC<PGProps> = styled(
    ({
        selectedTracerAddress,
        className,
        positionType,
        balances,
        fairPrice,
        quoteTicker,
        baseTicker,
        maxLeverage,
    }: PGProps) => {
        const [currency] = useState(0); // 0 quoted in base
        const { order } = useContext(OrderContext);
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
                            <InfoCell>
                                <Amount>
                                    <Leverage
                                        balances={balances}
                                        nextPosition={
                                            order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }
                                        }
                                        tradePrice={order?.price ?? 0}
                                        fairPrice={fairPrice}
                                        orderType={order?.orderType ?? 0}
                                        exposure={order?.exposure ?? 0}
                                    />
                                </Amount>
                                <CellTitle>Leverage</CellTitle>
                            </InfoCell>
                            <InfoCell inner>
                                <Amount>
                                    <AvailableMargin
                                        order={order}
                                        balances={balances}
                                        maxLeverage={maxLeverage}
                                        fairPrice={fairPrice}
                                    />
                                </Amount>
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
                                    {toApproxCurrency(
                                        calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage),
                                    )}
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
                                <Amount>{toApproxCurrency(lines[lines.length - 1]?.value)}</Amount>
                                <CellTitle>
                                    <StatusDot type="status-white" />
                                    Last Price
                                </CellTitle>
                            </InfoCell>
                        </Row>
                        <Row>
                            <BorderlessCell>
                                <LargeButton className="primary filled" onClick={closePosition}>
                                    Close Position
                                </LargeButton>
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
