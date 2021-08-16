import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';
import { Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import MarketChange from '@components/General/MarketChange';
import { LabelledTracers } from '@libs/types/TracerTypes';
import { PortfolioDropdown } from '@components/Portfolio';
import Tracer from '@libs/Tracer';

interface POProps {
    tracers: LabelledTracers;
}
const PositionMarketOverlay: FC<POProps> = ({ tracers }: POProps) => {
    const [currentMarket, setCurrentMarket] = useState('');
    const [marketKeyMap, setMarketKeyMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const marketKeyMap: Record<string, string> = {};
        Object.values(tracers).map((tracer: Tracer) => {
            marketKeyMap[tracer.address] = tracer.marketId;
        });
        setMarketKeyMap(marketKeyMap);
        setCurrentMarket(Object.keys(marketKeyMap)[0]);
    }, [tracers]);

    return (
        <StyledOverlay>
            <OverlayTitle>No Open Position.</OverlayTitle>
            {Object.keys(marketKeyMap).length ? (
                <>
                    <PortfolioDropdown
                        setOptions={(market) => setCurrentMarket(market as string)}
                        selectedOption={currentMarket}
                        keyMap={marketKeyMap}
                        placeHolder="Select Market"
                    />
                    <MarketPreviewContainer>
                        <InfoCol>
                            <div className="title">Market</div>
                            <div className="row">
                                <SLogo ticker={tracers[currentMarket]?.baseTicker} /> {tracers[currentMarket]?.marketId}
                            </div>
                        </InfoCol>
                        <InfoCol>
                            <div className="title">Last Price</div>
                            <div className="row">{toApproxCurrency(tracers[currentMarket]?.getOraclePrice())}</div>
                        </InfoCol>
                        <InfoCol>
                            <div className="title">24h</div>
                            <div className="row">
                                <MarketChange amount={tracers[currentMarket]?.get24HourChange()} />
                            </div>
                        </InfoCol>
                        <InfoCol>
                            <div className="title">Max Leverage</div>
                            <div className="row">{`${tracers[currentMarket]?.getMaxLeverage()}x`}</div>
                        </InfoCol>
                    </MarketPreviewContainer>
                </>
            ) : null}
        </StyledOverlay>
    );
};

export default PositionMarketOverlay;

const StyledOverlay = styled(Overlay)`
    background-color: var(--color-background-secondary) !important;
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
