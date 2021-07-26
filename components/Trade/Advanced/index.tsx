import React, { useContext, useEffect, useState } from 'react';
import { OrderContext, TracerContext } from 'context';
import { MarketSelect, AccountPanel } from './TradingPanel';
import { PlaceOrder } from './TradingPanel/TradingInput';
import styled from 'styled-components';
import TradingView from './RightPanel';
import { MARKET } from '@libs/types/OrderTypes';
import dynamic from 'next/dynamic';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Cookies from 'universal-cookie';
import { useToasts } from 'react-toast-notifications';
import { tourConfig } from './TourSteps'
import { useWeb3 } from '@context/Web3Context/Web3Context';

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
    const { addToast } = useToasts();
    const [tourCompleted, setTutorialCompleted] = useState<boolean>(false);
    const [isTourOpen, setTourOpen] = useState<boolean>(false);

    useEffect(() => {
        checkTutorialComplete();
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

    // Reactour
    useEffect(() => {
        if(account){
            triggerTutorial();
        }
    }, [account]);

    const triggerTutorial = async () => {
        // If cookie with flag does not exist,
        // start tutorial
        const cookies = new Cookies();
        if(cookies.get('tutorialCompleted') != 'true'){
            addToast(['Trading with Tracer', `Click here to learn how to trade with Tracer`], {
                appearance: 'info',
                autoDismiss: false,
            });
            // Get the toast notification element
            setTimeout(function(){
                const toast = document.querySelector('.notification-content') as HTMLDivElement;
                toast.addEventListener('click', function () {
                    const closeButton = document.querySelector('.toast-close') as HTMLButtonElement;
                    closeButton.click();
                    setTourOpen(true);
                });
                listenForDismiss();
            }, 10);
        }
    };

    // If user closes toast notification
    const listenForDismiss = async () => {
        const closeButton = document.querySelector('.toast-close') as HTMLButtonElement;
        closeButton.addEventListener('click', function () {
            setTutorialComplete();
        });
    };

    const checkTutorialComplete = () => {
        const cookies = new Cookies();
        if(cookies.get('tutorialCompleted') == 'true'){
            setTutorialCompleted(true);
        }
    };

    const setTutorialComplete = () => {
        const cookies = new Cookies();
        if(cookies.get('tutorialCompleted') != 'true'){
            cookies.set('tutorialCompleted', 'true', { path: '/' });
        }
    };

    const closeTour = () => {
        setTourOpen(false);

        // Reset the elements affected by the tour

        // Show the 'No Position Open' again
        const positionOverlay = document.getElementById('position-overlay') as HTMLElement;
        if (positionOverlay) {
            positionOverlay.removeAttribute('style');
        }

        // Disable the 'Close Position' button
        const closeOrderButton = document.getElementById('close-order-button') as HTMLButtonElement;
        if (closeOrderButton) {
            closeOrderButton.disabled = true;
        }

        // Reset Calculator and Margin modal Z-indexes
        const calculatorEl = document.getElementById('calculator-modal') as HTMLElement;
        const marginModalEl = document.getElementById('account-modal') as HTMLElement;
        if(calculatorEl){
            calculatorEl.removeAttribute('style');
        }
        if (marginModalEl) {
            marginModalEl.removeAttribute('style');
        }

        setTutorialComplete();
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
    };

    return (
        <>
            <div className={`container ${className}`}>
                <TradingPanel>
                    <MarketSelect account={account ?? ''} />
                    <PlaceOrder data-tour-id="placeorder-panel" selectedTracer={selectedTracer} account={account ?? ''} />
                    <AccountPanel selectedTracer={selectedTracer} account={account ?? ''} order={order} />
                </TradingPanel>
                <RightPanel>
                    <TradingView selectedTracer={selectedTracer} />
                </RightPanel>
                <Overlay id="trading-overlay" />
            </div>
            {!tourCompleted && 
                <Tour
                    onRequestClose={closeTour}
                    steps={tourConfig as Array<any>}
                    maskSpace={0}
                    isOpen={isTourOpen}
                    maskClassName="mask"
                    className="helper"
                    rounded={5}
                    showNumber={false}
                    updateDelay={0}
                    onAfterOpen={(e) => highlightDots(e)}
                    onBeforeClose={(e) => enableBodyScroll(e)}
                />
            }
        </>
    );
})`
    display: flex;
    height: 100%;
`;

export default Advanced;
