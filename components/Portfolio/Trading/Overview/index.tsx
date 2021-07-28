import React, { FC, useState } from 'react';
import Graph from './Graph';
import PositionGraph from './PositionGraph';
import EquityTable from './EqTable';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';
import { Menu, MenuItem } from '@components/General/Menu';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import PositionOverlay from '@components/Overlay/PositionOverlay';
import { useEffect } from 'react';
import { LabelledTracers } from '@libs/types/TracerTypes';

interface HRowProps {
    background?: string;
    border?: boolean;
}
const HeadingRow = styled.div<HRowProps>`
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 60px;
    width: 100%;
    background: ${(props) => (props.background ? (props.background as string) : 'transparent')};
    border-bottom: ${(props) => (props.border ? '1px solid var(--table-lightborder)' : 'none')};
`;

interface HPanelProps {
    background?: string;
}
const HPanel = styled.div<HPanelProps>`
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: auto;
    width: 100%;
    padding: 0 15px 16px;
    background: ${(props) => (props.background ? (props.background as string) : 'transparent')};

    ${EquityTable} {
        flex-basis: calc(60% - 8px);
    }

    ${Graph} {
        flex-basis: calc(40% - 8px);
        min-height: 342px;
    }
`;

const Title = styled.h1`
    font-size: var(--font-size-large);
    letter-spacing: var(--letter-spacing-extra-small);
    color: var(--color-text);
    margin-right: 2rem;
    padding: 0;
    width: fit-content;
    white-space: nowrap;
    font-weight: inherit;
`;

const StyledTriangleDown = styled.img`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0%, -50%);
    height: 0.5rem;
    transition: all 400ms ease-in-out;
    display: inline;

    &.rotate {
        transform: rotate(180deg);
        margin-top: -4px;
    }
`;

const Counter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -10px;
    border-radius: 20px;
    background: #3da8f5;
    color: #00156c;
    width: 52px;
    height: 32px;
    font-size: var(--font-size-small);
`;

const VScrollContainer = styled.div`
    height: auto;
    overflow: hidden auto;
`;

const HScrollContainer = styled.div`
    position: relative;
    display: flex;
    width: auto;
    height: auto;
    min-height: 30vh;
    overflow: auto hidden;
    padding: 16px 8px;
    box-sizing: unset;
`;

type PDProps = {
    setOptions: (val: number) => void;
    option: number;
    keyMap: Record<number, string>;
    className?: string;
};
const PortfolioDropdown: React.FC<PDProps> = styled(({ className, setOptions, option, keyMap }: PDProps) => {
    const [rotated, setRotated] = useState(false);
    const menu = (
        <Menu
            onClick={({ key }: any) => {
                setOptions(parseInt(key));
                setRotated(false);
            }}
        >
            {Object.keys(keyMap).map((key) => {
                return (
                    <MenuItem key={key}>
                        <span>{keyMap[parseInt(key)]}</span>
                    </MenuItem>
                );
            })}
        </Menu>
    );
    const handleVisibleChange = (visible: boolean) => {
        setRotated(visible);
    };
    return (
        <Dropdown className={className} overlay={menu} placement="bottomCenter" onVisibleChange={handleVisibleChange}>
            <Button height="medium">
                {keyMap[option]}
                <StyledTriangleDown className={rotated ? 'rotate' : ''} src="/img/general/triangle_down_cropped.svg" />
            </Button>
        </Dropdown>
    );
})`
    position: relative;
    padding-right: 8px;
    margin: unset;
    &:hover {
        background: none;
        color: var(--color-primary);
    }
`;

interface OProps {
    tracers: LabelledTracers;
}
const Overview: FC<OProps> = ({ tracers }: OProps) => {
    const { account } = useWeb3();
    const [currentPortfolio, setCurrentPortfolio] = useState(1);
    const [currentPNL, setCurrentPNL] = useState(1);
    const [positions, setPositions] = useState<Tracer[]>([]);
    const [holdings, setHoldings] = useState<Tracer[]>([]);

    // fetch all tracers where the user has an open position
    useEffect(() => {
        const positions: Tracer[] = [];
        const holdings: Tracer[] = [];
        Object.values(tracers).map((tracer) => {
            const balance = tracer?.getBalance() ?? defaults.balances;
            if (!balance.quote.eq(0)) {
                // if the user has deposited
                holdings.push(tracer);
            }
            if (!balance.base.eq(0)) {
                // if the user has a position
                positions.push(tracer);
            }
        });
        setPositions(positions);
        setHoldings(holdings);
    }, [tracers]);

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
            <HeadingRow background={'#00125D'}>
                <Title>Equity Breakdown</Title>
                <div className="flex justify-content-between">
                    <PortfolioDropdown
                        setOptions={setCurrentPortfolio}
                        option={currentPortfolio}
                        keyMap={portfolioKeyMap}
                    />
                    <PortfolioDropdown setOptions={setCurrentPNL} option={currentPNL} keyMap={pnlKeyMap} />
                </div>
            </HeadingRow>
            <HPanel background={'#00125D'}>
                <EquityTable
                    balances={holdings[0]?.getBalance() ?? defaults.balances}
                    fairPrice={holdings[0]?.getFairPrice() ?? defaults.fairPrice}
                    baseTicker={holdings[0]?.baseTicker ?? defaults.baseTicker}
                    quoteTicker={holdings[0]?.quoteTicker ?? defaults.quoteTicker}
                />
                <Graph title="Profit and Loss" background selectedTracerAddress={positions[0]?.address ?? ''} />
                {!account ? <ConnectOverlay /> : null}
            </HPanel>
            <HeadingRow border={true}>
                <Title>Open Positions</Title>
                <Counter>{positions?.length}</Counter>
            </HeadingRow>
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
                    <PositionOverlay tracers={positions} showMarketPreview={true} />
                ) : null}
            </HScrollContainer>
        </VScrollContainer>
    );
};

export default Overview;
