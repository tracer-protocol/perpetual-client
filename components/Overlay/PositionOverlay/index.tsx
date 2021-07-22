import React, { FC, useState } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';
import { Menu, MenuItem } from '@components/General/Menu';
import Dropdown from 'antd/lib/dropdown';
import { Button, Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import MarketChange from '@components/General/MarketChange';

interface POProps {
    tracers?: any;
}
const PositionOverlay: FC<POProps> = ({ tracers }: POProps) => {
    const [currentMarket, setCurrentMarket] = useState(-1);

    const marketKeyMap: Record<number, string> = {};

    tracers?.map((tracer: any, i: number) => {
        marketKeyMap[i] = tracer.marketId;
    });

    return (
        <StyledOverlay>
            <OverlayTitle>No Open Position.</OverlayTitle>
            <SelectMarketDropdown setOptions={setCurrentMarket} option={currentMarket} keyMap={marketKeyMap} />
            {currentMarket !== -1 ? (
                <MarketPreviewContainer>
                    <InfoCol>
                        <div className="title">Market</div>
                        <div className="row">
                            <SLogo ticker={tracers[currentMarket]?.baseTicker} /> {tracers[currentMarket]?.marketId}
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">Last Price</div>
                        {tracers !== undefined ? (
                            <div className="row">
                                {toApproxCurrency(tracers[currentMarket]?.getOraclePrice()) ?? null}
                            </div>
                        ) : null}
                    </InfoCol>
                    <InfoCol>
                        <div className="title">24h</div>
                        <div className="row">
                            <MarketChange amount={2.38} />
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">Max Leverage</div>
                        {tracers !== undefined ? (
                            <div className="row">{toApproxCurrency(tracers[currentMarket]?.maxLeverage) ?? null}</div>
                        ) : null}
                    </InfoCol>
                </MarketPreviewContainer>
            ) : null}
        </StyledOverlay>
    );
};

export default PositionOverlay;

const MarketPreviewContainer = styled.div`
    display: flex;
    background-color: var(--color-accent);
    width: 600px;
    padding: 10px 20px;
    border-radius: 7px;
    margin-top: 10px;

    .title {
        height: 20px;
        color: var(--color-secondary);
        font-size: var(--font-size-small);
        display: flex;
        align-items: center;
    }

    .row {
        height: 40px;
        display: flex;
        align-items: center;
    }
`;

const SLogo = styled(Logo)`
    margin-right: 5px;
`;

const InfoCol = styled.div`
    width: 25%;
`;

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
            <Button>
                {selected ? keyMap[option] : 'Select Market'}
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

const StyledOverlay = styled(Overlay)`
    background-color: var(--color-background-secondary);
`;

const OverlayTitle = styled.div`
    font-size: var(--font-size-medium);
`;
