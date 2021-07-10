import React, { FC, useState } from 'react';
import Graphs from './Graph';
import Equity from './Equity';
import Tracer from '@libs/Tracer';
import styled from 'styled-components';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';
import { Menu, MenuItem } from '@components/General/Menu';
import { Box } from '@components/General';

const HPanel = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 400px;
    width: 100%;
    margin-bottom: 20px;
    padding: 20px 15px;
    margin-bottom: 20px;

    .equityStats {
        flex-basis: calc(60% - 7.5px);
    }

    .pnlGraph {
        flex-basis: calc(40% - 7.5px);
    }
`;

const Title = styled.h1`
    font-size: var(--font-size-large);
    letter-spacing: -0.4px;
    color: var(--color-text);
    margin-bottom: 0.5rem;
    margin-right: 2rem;
    padding: 0;
    width: fit-content;
    white-space: nowrap;
    font-weight: inherit;
`;

const SBox = styled(Box)`
    display: flex;
    width: 100%;
    padding-bottom: 0px;
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

const PortfolioDropdownButton = styled(Button)`
    height: var(--height-medium-button);
    padding: 0;
    min-width: 145px;
    font-size: var(--font-size-medium);
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
    padding-right: 10px;
    margin: unset;
    &:hover {
        background: none;
        color: var(--color-primary);
    }
`;

const Overview: FC<{
    selectedTracer: Tracer | undefined;
}> = ({ selectedTracer }) => {
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

    return <>
        <SBox>
            <Title>Equity Breakdown</Title>
            <div className='flex justify-content-between'>
                <PortfolioDropdown 
                    setOptions={setCurrentPortfolio}
                    option={currentPortfolio}
                    keyMap={portfolioKeyMap}
                />
                <PortfolioDropdown 
                    setOptions={setCurrentPNL}
                    option={currentPNL}
                    keyMap={pnlKeyMap}
                />
            </div>
        </SBox>
        <HPanel>
            <Equity className="equityStats" selectedTracerAddress={selectedTracer?.address ?? ''} />
            <Graphs className="pnlGraph" selectedTracerAddress={selectedTracer?.address ?? ''} />
        </HPanel>
    </>;
};

export default Overview;
