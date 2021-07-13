import React, { FC, useContext, useEffect, useState } from 'react';
import Graph from './Graph';
import PositionGraph from './PositionGraph';
import Equity from './Equity';
import Tracer from '@libs/Tracer';
import styled from 'styled-components';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';
import { Menu, MenuItem } from '@components/General/Menu';
import { FactoryContext, initialFactoryState } from '@context/FactoryContext';

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
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: auto;
    width: 100%;
    padding: 0 15px 16px;
    background: ${(props) => (props.background ? (props.background as string) : 'transparent')};
    .equityStats {
        flex-basis: calc(60% - 8px);
        &.show {
            height: fit-content;
            max-height: 400px;
            tr:nth-child(2) td,
            tr:nth-child(3) td,
            tr:nth-child(4) td,
            tr:nth-child(5) td {
                opacity: 1;
                border-color: var(--table-darkborder);
            }
        }
    }

    .pnlGraph {
        flex-basis: calc(40% - 8px);
        min-height: 342px;
    }
`;

const Title = styled.h1`
    font-size: var(--font-size-large);
    letter-spacing: -0.4px;
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

const PortfolioDropdownButton = styled(Button)`
    height: var(--height-medium-button);
    padding: 0;
    min-width: 145px;
`;

const VScrollContainer = styled.div`
    height: auto;
    overflow: hidden auto;
`;

const HScrollContainer = styled.div`
    display: flex;
    width: auto;
    height: auto;
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
            <PortfolioDropdownButton>
                {keyMap[option]}
                <StyledTriangleDown className={rotated ? 'rotate' : ''} src="/img/general/triangle_down_cropped.svg" />
            </PortfolioDropdownButton>
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

const Overview: FC<{
    selectedTracer?: Tracer | undefined;
}> = ({ selectedTracer }) => {
    const [currentPortfolio, setCurrentPortfolio] = useState(1);
    const [currentPNL, setCurrentPNL] = useState(1);
    const { factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const [tracersAddress, setTracersAddress] = useState<string[]>([]);

    useEffect(() => {
        if (tracers) {
            const temp = [];
            for (const key of Object.keys(tracers)) {
                temp.push(tracers[key].address);
            }
            setTracersAddress(temp);
        }
    }, [tracersAddress]);

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
        <>
            <VScrollContainer>
                <HeadingRow background={`#00125D`}>
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
                <HPanel background={`#00125D`}>
                    <Equity className="equityStats" selectedTracerAddress={selectedTracer?.address ?? ''} />
                    {tracersAddress[0] === undefined ? null : (
                        <Graph
                            className="pnlGraph"
                            title="Profit and Loss"
                            background
                            selectedTracerAddress={tracersAddress[0]}
                        />
                    )}
                </HPanel>
                <HeadingRow border={true}>
                    <Title>Open Positions</Title>
                    <Counter>4</Counter>
                </HeadingRow>
                <HScrollContainer>
                    {tracersAddress[0] === undefined ? null : (
                        <PositionGraph selectedTracerAddress={tracersAddress[0]} positionType={1} />
                    )}
                    {tracersAddress[0] === undefined ? null : (
                        <PositionGraph selectedTracerAddress={tracersAddress[0]} positionType={2} />
                    )}
                    {tracersAddress[0] === undefined ? null : (
                        <PositionGraph selectedTracerAddress={tracersAddress[0]} positionType={1} />
                    )}
                </HScrollContainer>
            </VScrollContainer>
        </>
    );
};

export default Overview;
