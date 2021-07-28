import styled from 'styled-components';
import React, { useState } from 'react';
import { Menu, MenuItem } from '@components/General/Menu';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';

export const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    border: 1px solid #0c3586;
`;

export const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-bottom: 1px solid #0c3586;
`;

export const VScrollContainer = styled.div`
    overflow: auto;
`;

export const HScrollContainer = styled.div`
    position: relative;
    display: flex;
    width: auto;
    height: auto;
    min-height: 30vh;
    overflow: auto hidden;
    padding: 16px 8px;
    box-sizing: unset;
`;

export const Title = styled.div`
    font-size: var(--font-size-large);
    color: var(--color-text);
    white-space: nowrap;
    letter-spacing: var(--letter-spacing-extra-small);
`;

export const SmallTitle = styled.div`
    font-size: var(--font-size-medium);
    letter-spacing: var(--letter-spacing-extra-small);
`;

interface SHProps {
    background?: string;
    border?: boolean;
}
export const SectionHeader = styled.div<SHProps>`
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 60px;
    width: 100%;
    background: ${(props: SHProps) => (props.background ? (props.background as string) : 'transparent')};
    border-bottom: ${(props: SHProps) => (props.border ? '1px solid var(--table-lightborder)' : 'none')};
`;

interface PDProps {
    setOptions: (val: number) => void;
    option: number;
    keyMap: Record<number, string>;
    className?: string;
}
export const PortfolioDropdown: React.FC<PDProps> = styled(({ className, setOptions, option, keyMap }: PDProps) => {
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

export const Counter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    width: 52px;
    height: 32px;
    font-size: var(--font-size-small);
    margin-left: 20px;
`;

interface HPProps {
    background?: string;
}
export const HPanel = styled.div<HPProps>`
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 15px 16px;
    background: ${(props: HPProps) => (props.background ? (props.background as string) : 'transparent')};
    .equityStats {
        flex-basis: calc(60% - 8px);
        &.show {
            max-height: 420px;
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

export const StatusIndicator = styled.div<{ color: string }>`
    color: ${(props) => props.color};
`;

export function getStatusColour(status: string): string {
    let colour = 'var(--status-white)';
    if (status === 'Eligible') {
        colour = 'var(--status-orange)';
    } else if (status === 'Approaching') {
        colour = 'var(--status-yellow)';
    }
    return colour;
}

export const SecondaryCell = styled.div`
    color: var(--color-secondary);
    font-size: var(--font-size-small);
`;

// dummy data
export const activeDeposits = [
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
    {
        market: 'TSLA/USDC',
        realisedAPY: '86.3%',
        ownership: '68367',
        unrealisedValue: '4657',
        instant: '420',
        delayed: '420',
    },
];

export const depositsHistory = [
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        amount: '450',
        minted: '345 iETH/USDC',
        details: '0x23......2321',
    },
];

export const activeWithdrawals = [
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
    {
        market: 'TSLA/USDC',
        unrealisedValue: '4657',
        status: 'Pending',
        daysRemaining: '4 Days',
    },
];

export const withdrawalsHistory = [
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
    {
        date: '15th July 2021 4:32pm',
        market: 'TSLA/USDC',
        type: 'Instant',
        amount: '450 iETH/USDC',
        fees: '45 USDC',
        details: '0x23......2321',
    },
];
