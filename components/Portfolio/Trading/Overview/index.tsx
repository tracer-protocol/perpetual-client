import React, { FC, useState } from 'react';
import styled from 'styled-components';
import Graph from './Graph';
import PositionGraph from './PositionGraph';
import Equity from './Equity';
import { defaults } from '@libs/Tracer';
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

interface OProps {
    fetchedTracers: any;
}
const Overview: FC<OProps> = ({ fetchedTracers }: OProps) => {
    const { account } = useWeb3();
    const [currentPortfolio, setCurrentPortfolio] = useState(1);
    const [currentPNL, setCurrentPNL] = useState(1);

    const portfolioKeyMap: Record<number, string> = {
        1: 'Entire Portfolio',
        2: 'ETH-USDC Market',
    };

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
                <Equity
                    className="equityStats"
                    balances={fetchedTracers[0]?.getBalance() ?? defaults.balances}
                    fairPrice={fetchedTracers[0]?.getFairPrice() ?? defaults.fairPrice}
                    baseTicker={fetchedTracers[0]?.baseTicker ?? defaults.baseTicker}
                    quoteTicker={fetchedTracers[0]?.quoteTicker ?? defaults.quoteTicker}
                />
                <Graph
                    className="pnlGraph"
                    title="Profit and Loss"
                    background
                    selectedTracerAddress={fetchedTracers[0]?.address ?? ''}
                />
                {!account ? <ConnectOverlay /> : null}
            </HPanel>
            <SectionHeader border={true}>
                <Title>Withdrawals</Title>
                <Counter>{fetchedTracers?.length}</Counter>
            </SectionHeader>
            <HScrollContainer>
                {fetchedTracers.map((tracer: any, i: number) => (
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
                ) : fetchedTracers.length === 0 ? (
                    <PositionOverlay tracers={fetchedTracers} showMarketPreview={true} />
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
