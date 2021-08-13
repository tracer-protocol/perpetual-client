import styled from 'styled-components';
import React, { FC, useState } from 'react';
import { Menu, MenuItem } from '@components/General/Menu';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';
import EquityTable from '@components/Portfolio/Trading/Overview/EqTable';
import Graph from '@components/Portfolio/Trading/Overview/Graph';

export const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    height: var(--height-content);
    border: 1px solid #0c3586;
`;

export const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    height: var(--height-content);
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

type KeyType = number | string;
interface PDProps {
    className?: string;
    setOptions: (val: KeyType) => void;
    selectedOption: KeyType;
    keyMap: Record<KeyType, string>;
    placeHolder?: string;
}

export const PortfolioDropdown: FC<PDProps> = styled(
    ({ className, setOptions, selectedOption, keyMap, placeHolder }: PDProps) => {
        const [rotated, setRotated] = useState(false);
        const [hasSelected, setHasSelected] = useState(false);
        const menu = (
            <Menu
                onClick={({ key }) => {
                    setOptions(key);
                    setRotated(false);
                    setHasSelected(true);
                }}
            >
                {Object.keys(keyMap).map((key) => {
                    return (
                        <MenuItem key={key}>
                            <span>{keyMap[key]}</span>
                        </MenuItem>
                    );
                })}
            </Menu>
        );
        const handleVisibleChange = (visible: boolean) => {
            setRotated(visible);
        };
        return (
            <Dropdown
                className={className}
                overlay={menu}
                placement="bottomCenter"
                onVisibleChange={handleVisibleChange}
            >
                <Button height="medium">
                    {/* 
                        If the user has not selected an option and has chosen a place holder 
                        then display the placeholder
                    */}
                    {!hasSelected && placeHolder ? placeHolder : keyMap[selectedOption]}
                    <StyledTriangleDown
                        className={rotated ? 'rotate' : ''}
                        src="/img/general/triangle_down_cropped.svg"
                    />
                </Button>
            </Dropdown>
        );
    },
)`
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

    ${EquityTable} {
        flex-basis: calc(60% - 8px);
    }
    ${Graph} {
        flex-basis: calc(40% - 8px);
        min-height: 342px;
    }
`;

export const StatusIndicator = styled.div<{ color: string }>`
    color: ${(props) => props.color};
`;

export const calcStatus: (
    quote: number,
    availableMarginPercent: number,
) => {
    text: string;
    color: string;
} = (base, availableMarginPercent) => {
    if (availableMarginPercent === 0 || base === 0 || availableMarginPercent >= 1) {
        return {
            text: 'Closed',
            color: '#fff',
        };
    } else if (availableMarginPercent > 0.1) {
        return {
            text: 'Open',
            color: '#05CB3A',
        };
    } else if (availableMarginPercent > 0) {
        return {
            text: 'Approaching Liquidation',
            color: '#F4AB57',
        };
    } else {
        return {
            text: 'Eligible for Liquidation',
            color: '#F15025',
        };
    }
};
