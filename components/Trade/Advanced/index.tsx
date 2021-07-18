import React, { useContext, useEffect, useState } from 'react';
import { OrderContext, TracerContext } from 'context';
import { MarketSelect, AccountPanel } from './TradingPanel';
import { PlaceOrder } from './TradingPanel/TradingInput';
import styled from 'styled-components';
import TradingView from './RightPanel';
import { MARKET } from '@context/OrderContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import dynamic from 'next/dynamic';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { tourConfig } from './TourSteps'

const Tour = dynamic(import('reactour'), { ssr: false });

const TradingPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    position: relative;
    border-left: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-bottom: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    height: 87vh;
    border-bottom: 1px solid #0c3586;
`;

const Overlay = styled.div`
    position: absolute;
    background: black;
    transition: opacity 0.3s ease-in-out 0.1s;
    opacity: 0;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -9999;

    &.display {
        z-index: 2;
        opacity: 0.5;
    }
`;

const Advanced: React.FC = styled(({ className }) => {
    const { account } = useWeb3();
    const { selectedTracer } = useContext(TracerContext);
    const { order, orderDispatch = () => console.error('Order dispatch not set') } = useContext(OrderContext);
    const [isAdjust] = useState(false);
    const [isTourOpen, setTourOpen] = useState<boolean>(false);

    useEffect(() => {
        if (orderDispatch) {
            orderDispatch({ type: 'setLock', value: true });
            orderDispatch({ type: 'setAdvanced', value: true });
        } else {
            console.error('Order dispatch not set');
        }
    }, []);

    useEffect(() => {
        if (isAdjust) {
            if (orderDispatch) {
                orderDispatch({ type: 'setOrderType', value: MARKET });
            } else {
                console.error('Order dispatch not set');
            }
        }
    }, [isAdjust]);

    const closeTour = () => {
        setTourOpen(false);

        // Reset the elements affected by the tour

        // Show the 'No Position Open' again
        const positionOverlay = document.querySelector('div[class*="PositionOverlay__StyledOverlay"]') as HTMLElement;
        if (positionOverlay) {
            positionOverlay.style.display = 'block';
        }

        // Disable the 'Close Position' button
        const closeOrderButton = document.querySelector('button[class*="OrderButtons__CloseOrder"]') as HTMLButtonElement;
        if (closeOrderButton) {
            closeOrderButton.disabled = true;
        }
    };

    const highlightDots = (e: HTMLDivElement) => {
        e.addEventListener('click', function () {
            const navDots: Array<any> = Array.from(document.querySelectorAll('nav[data-tour-elem="navigation"] button'));
            var currentIndex = 0;
            // Wait for Reactour to apply styling
            setTimeout(function(){
                navDots.map((dot, i) => { 
                    if(dot.classList.contains('reactour__dot--is-active')){
                        currentIndex = i;
                    }
                });
                navDots.slice(0, currentIndex).map((dot) => {
                    dot.classList.add('reactour__dot--is-active');
                });
            }, 10);
        });
        // Also prevent body scrolling when tour open
        disableBodyScroll(e);
    }
    
    return (
        // Remove after testing
        <div className={`container ${className}`}>
            <TradingPanel onClick={() => setTourOpen(true)}  >
                <MarketSelect account={account ?? ''} />
                <PlaceOrder selectedTracer={selectedTracer} account={account ?? ''} />
                <AccountPanel selectedTracer={selectedTracer} account={account ?? ''} order={order} />
            </TradingPanel>
            <RightPanel>
                <TradingView selectedTracer={selectedTracer} />
            </RightPanel>
            <Overlay id="trading-overlay" />
            {/* TODO: detect wallet connect first time, set a cookie */}
            <Tour
                onRequestClose={closeTour}
                steps={tourConfig as Array<any>}
                maskSpace={0}
                isOpen={isTourOpen}
                maskClassName="mask"
                className="helper"
                rounded={5}
                showNumber={false}
                onAfterOpen={(e) => highlightDots(e)}
                onBeforeClose={(e) => enableBodyScroll(e)}
            />
        </div>
    );
})`
    display: flex;
    height: 100%;
`;

export default Advanced;
