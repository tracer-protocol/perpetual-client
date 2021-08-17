import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';
import { Button, Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import MarketChange from '@components/General/MarketChange';
import { LabelledTracers } from '@libs/types/TracerTypes';
import { PortfolioDropdown } from '@components/Portfolio';
import Tracer from '@libs/Tracer';
import Link from 'next/link';

interface POProps {
    tracers: LabelledTracers;
}
const PositionMarketOverlay: FC<POProps> = ({ tracers }: POProps) => {
    const [currentMarket, setCurrentMarket] = useState('');
    const [marketKeyMap, setMarketKeyMap] = useState<Record<string, string>>({});
    const [count, setCount] = useState(0);

    const [show, setShow] = useState(false);
    const updateTimer = React.useRef(null);

    function setUpdate() {
        setShow(false);
        // @ts-ignore
        updateTimer.current = setTimeout(() => {
            setShow(true);
            updateTimer.current = null;
        }, 100);
    }

    useEffect(() => {
        if (!updateTimer.current) {
            setUpdate();
        }
    }, [count]);

    useEffect(() => {
        return () => {
            if (updateTimer.current) {
                // @ts-ignore
                clearTimeout(updateTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Increment count every 6 seconds
            if (count === Object.keys(marketKeyMap).length - 1) {
                setCount(0);
            } else {
                setCount(count + 1);
            }
        }, 6000);
        setCurrentMarket(Object.keys(marketKeyMap)[count]);
        return () => {
            clearInterval(interval);
        };
    }, [count]);

    useEffect(() => {
        const marketKeyMap: Record<string, string> = {};
        Object.values(tracers).map((tracer: Tracer) => {
            marketKeyMap[tracer.address] = tracer.marketId;
        });
        setMarketKeyMap(marketKeyMap);
        setCurrentMarket(Object.keys(marketKeyMap)[count]);
    }, [tracers]);

    return (
        <StyledOverlay>
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
                            <div className={`${show ? 'show' : ''} row`}>
                                <SLogo ticker={tracers[currentMarket]?.baseTicker} /> {tracers[currentMarket]?.marketId}
                            </div>
                        </InfoCol>
                        <InfoCol>
                            <div className="title">Last Price</div>
                            <div className={`${show ? 'show' : ''} row`}>
                                {toApproxCurrency(tracers[currentMarket]?.getOraclePrice())}
                            </div>
                        </InfoCol>
                        <InfoCol>
                            <div className="title">24h</div>
                            <div className="row">
                                <MarketChange amount={tracers[currentMarket]?.get24HourChange()} />
                            </div>
                        </InfoCol>
                        <InfoCol>
                            <div className="title">Max Leverage</div>
                            <div className={`${show ? 'show' : ''} row`}>{`${tracers[
                                currentMarket
                            ]?.getMaxLeverage()}x`}</div>
                        </InfoCol>
                    </MarketPreviewContainer>
                </>
            ) : null}
            <OpenPositionWrapper>
                <Link href="/">
                    <Button height="medium">Open Position</Button>
                </Link>
            </OpenPositionWrapper>
        </StyledOverlay>
    );
};

export default PositionMarketOverlay;

const StyledOverlay = styled(Overlay)`
    background-color: var(--color-background-secondary) !important;
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
        opacity: 0;

        &.show {
            opacity: 1;
            transition: 1.5s;
        }
    }
`;

const InfoCol = styled.div`
    width: 25%;
`;

const SLogo = styled(Logo)`
    margin-right: 5px;
`;

const OpenPositionWrapper = styled.div`
    padding: 10px;
`;
