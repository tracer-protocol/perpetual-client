import React, { FC, useState } from 'react';
import Graph from './Graph';
import PositionGraph from './PositionGraph';
import EquityTable from './EqTable';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import PositionMarketOverlay from '@components/Overlay/PositionMarketOverlay';
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
import { LabelledTracers } from '@libs/types/TracerTypes';

interface OProps {
    tracers: LabelledTracers;
    fetchedTracers: Tracer[];
    allFilledOrders: LabelledOrders;
}
const Overview: FC<OProps> = ({ tracers, fetchedTracers, allFilledOrders }: OProps) => {
    const { account } = useWeb3();
    const [currentPortfolio, setCurrentPortfolio] = useState(-1);
    const [currentPNL, setCurrentPNL] = useState(1);

    const portfolioKeyMap: Record<number, string> = {};
    portfolioKeyMap[-1] = 'Entire Portfolio';

    const positions: Tracer[] = fetchedTracers?.filter((tracer) => !tracer.getBalance().base.eq(0));
    const holdings: Tracer[] = fetchedTracers?.filter((tracer) => !tracer.getBalance().quote.eq(0));
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
                        setOptions={(num) => setCurrentPortfolio(num as number)}
                        selectedOption={currentPortfolio}
                        keyMap={portfolioKeyMap}
                    />
                    <PortfolioDropdown
                        setOptions={(num) => setCurrentPNL(num as number)}
                        selectedOption={currentPNL}
                        keyMap={pnlKeyMap}
                    />
                </DropdownContainer>
            </SectionHeader>
            <HPanel background={`var(--color-background-secondary)`}>
                <EquityTable
                    holdings={holdings}
                    currentPortfolio={currentPortfolio}
                    allFilledOrders={allFilledOrders}
                />
                <Graph title="Profit and Loss" background selectedTracerAddress={fetchedTracers[0]?.address ?? ''} />
                {!account ? <ConnectOverlay /> : null}
            </HPanel>
            <SectionHeader border>
                <Title>Open Positions</Title>
                <Counter>{fetchedTracers?.filter((tracer) => !tracer.getBalance().base.eq(0)).length}</Counter>
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
                    <PositionMarketOverlay tracers={tracers} />
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
