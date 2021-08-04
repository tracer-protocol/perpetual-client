import React, { FC, useState } from 'react';
import Graph from './Graph';
import PositionGraph from './PositionGraph';
import EquityTable from './EqTable';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import PositionOverlay from '@components/Overlay/PositionOverlay';
import {
    VScrollContainer,
    PortfolioDropdown,
    Title,
    HScrollContainer,
    Counter,
    SectionHeader,
    HPanel,
} from '@components/Portfolio';
import { LabelledOrders } from '@libs/types/OrderTypes';

interface OProps {
    positions: Tracer[];
    holdings: Tracer[];
    allFilledOrders: LabelledOrders;
}
const Overview: FC<OProps> = ({ positions, holdings, allFilledOrders }: OProps) => {
    const { account } = useWeb3();
    const [currentPortfolio, setCurrentPortfolio] = useState(0);
    const [currentPNL, setCurrentPNL] = useState(1);

    const portfolioKeyMap: Record<number, string> = {};

    holdings?.map((holding: any, i: number) => {
        portfolioKeyMap[i] = holding.marketId;
    });

    const pnlKeyMap: Record<number, string> = {
        1: 'All Time',
        2: 'Today',
        3: 'This Week',
        4: 'This Month',
    };

    return (
        <VScrollContainer>
            <SectionHeader background={`var(--color-background-secondary)`}>
                <Title>Equity Breakdown</Title>
                <DropdownContainer>
                    <PortfolioDropdown
                        setOptions={setCurrentPortfolio}
                        option={currentPortfolio}
                        keyMap={portfolioKeyMap}
                    />
                    <PortfolioDropdown setOptions={setCurrentPNL} option={currentPNL} keyMap={pnlKeyMap} />
                </DropdownContainer>
            </SectionHeader>
            <HPanel background={`var(--color-background-secondary)`}>
                <EquityTable
                    holdings={holdings}
                    currentPortfolio={currentPortfolio}
                    allFilledOrders={allFilledOrders}
                />
                <Graph title="Profit and Loss" background selectedTracerAddress={positions[0]?.address ?? ''} />
                {!account ? <ConnectOverlay /> : null}
            </HPanel>
            <SectionHeader border>
                <Title>Open Positions</Title>
                <Counter>{positions?.length}</Counter>
            </SectionHeader>
            <HScrollContainer>
                {positions.map((tracer: any, i: number) => (
                    <PositionGraph
                        key={`position-graph-${i}`}
                        selectedTracerAddress={tracer?.address ?? ''}
                        base={tracer?.getBalance().base ?? defaults.base}
                        quote={tracer?.getBalance().quote ?? defaults.quote}
                        market={tracer?.marketId}
                        fairPrice={tracer?.getFairPrice() ?? defaults.fairPrice}
                        maxLeverage={tracer?.getMaxLeverage() ?? defaults.maxLeverage}
                    />
                ))}
                {!account ? (
                    <ConnectOverlay />
                ) : positions.length === 0 ? (
                    <PositionOverlay tracers={positions} showMarketPreview />
                ) : null}
            </HScrollContainer>
        </VScrollContainer>
    );
};

export default Overview;

const DropdownContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
`;
