import React, { FC, useState } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';
import { Menu, MenuItem } from '@components/General/Menu';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';

const StyledOverlay = styled(Overlay)`
    font-size: var(--font-size-medium);
    background-color: var(--color-background-secondary);
`;

const PositionOverlay: FC = () => {
    const [currentMarket, setCurrentMarket] = useState(1);

    const marketKeyMap: Record<number, string> = {
        1: 'ETH',
        2: 'BTC',
        3: 'TSLA',
    };

    return (
        <StyledOverlay>
            No Open Position.
            <SelectMarketDropdown setOptions={setCurrentMarket} option={currentMarket} keyMap={marketKeyMap} />
        </StyledOverlay>
    );
};

export default PositionOverlay;

interface PDProps {
    setOptions: (val: number) => void;
    option: number;
    keyMap: Record<number, string>;
    className?: string;
}
const SelectMarketDropdown: React.FC<PDProps> = styled(({ className, setOptions, option, keyMap }: PDProps) => {
    const [rotated, setRotated] = useState(false);
    const [selected, setSelected] = useState(false);
    const menu = (
        <Menu
            onClick={({ key }: any) => {
                setOptions(parseInt(key));
                setRotated(false);
                setSelected(true);
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
                {selected ? keyMap[option] : <div>Select Market</div>}
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

const PortfolioDropdownButton = styled(Button)`
    height: var(--height-medium-button);
    padding: 0;
    min-width: 170px;
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
