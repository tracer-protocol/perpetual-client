import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';
import { Menu, MenuItem } from '@components/General/Menu';
import Dropdown from 'antd/lib/dropdown';
import { Button, Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import MarketChange from '@components/General/MarketChange';
import { LabelledTracers } from '@libs/types/TracerTypes';

interface POProps {
    tracers: LabelledTracers;
    showMarketPreview: boolean;
}
const PositionMarketOverlay: FC<POProps> = ({ tracers, showMarketPreview }: POProps) => {
    const [currentMarket, setCurrentMarket] = useState(-1);
    const [marketKeyMap, setMarketKeyMap] = useState({});

    useEffect(() => {
        const marketKeyMap: Record<number, string> = {};
        Object.values(tracers).map((tracer: any, i: number) => {
            marketKeyMap[i] = tracer.marketId;
        });
        setMarketKeyMap(marketKeyMap);
    }, [tracers]);

    return (
        <StyledOverlay id="position-overlay">
            <OverlayTitle>No Open Position.</OverlayTitle>
            {showMarketPreview ? (
                <SelectMarketDropdown setOptions={setCurrentMarket} option={currentMarket} keyMap={marketKeyMap} />
            ) : null}

            {currentMarket === -1 ? (
                <MarketPreviewContainer>
                    <InfoCol>
                        <div className="title">Market</div>
                        <div className="row">
                            <SLogo ticker={tracers[Object.keys(tracers)[0]]?.baseTicker} />{' '}
                            {tracers[Object.keys(tracers)[0]]?.marketId}
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">Last Price</div>
                        <div className="row">
                            {toApproxCurrency(tracers[Object.keys(tracers)[0]]?.getOraclePrice())}
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">24h</div>
                        <div className="row">
                            <MarketChange amount={tracers[Object.keys(tracers)[0]]?.get24HourChange()} />
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">Max Leverage</div>
                        <div className="row">{`${tracers[Object.keys(tracers)[0]]?.getMaxLeverage()}x`}</div>
                    </InfoCol>
                </MarketPreviewContainer>
            ) : (
                <MarketPreviewContainer>
                    <InfoCol>
                        <div className="title">Market</div>
                        <div className="row">
                            <SLogo ticker={tracers[Object.keys(tracers)[currentMarket]].baseTicker} />{' '}
                            {tracers[Object.keys(tracers)[currentMarket]].marketId}
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">Last Price</div>
                        <div className="row">
                            {toApproxCurrency(tracers[Object.keys(tracers)[currentMarket]].getOraclePrice())}
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">24h</div>
                        <div className="row">
                            <MarketChange amount={tracers[Object.keys(tracers)[currentMarket]].get24HourChange()} />
                        </div>
                    </InfoCol>
                    <InfoCol>
                        <div className="title">Max Leverage</div>
                        <div className="row">{`${tracers[Object.keys(tracers)[currentMarket]].getMaxLeverage()}x`}</div>
                    </InfoCol>
                </MarketPreviewContainer>
            )}
        </StyledOverlay>
    );
};

export default PositionMarketOverlay;

const StyledOverlay = styled(Overlay)`
    background-color: var(--color-background-secondary);
`;

const OverlayTitle = styled.div`
    font-size: var(--font-size-medium);
`;

const MarketPreviewContainer = styled.div`
    display: flex;
    background-color: var(--color-accent);
    width: 700px;
    padding: 10px 20px;
    border-radius: 7px;
    margin-top: 10px;

    .title {
        height: 20px;
        color: var(--color-secondary);
        display: flex;
        align-items: center;
    }

    .row {
        height: 40px;
        display: flex;
        align-items: center;
        font-size: var(--font-size-medium);
    }
`;

const InfoCol = styled.div`
    width: 25%;
`;

const SLogo = styled(Logo)`
    margin-right: 5px;
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
            <Button height="medium">
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
