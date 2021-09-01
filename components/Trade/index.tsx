import React, { FC, useContext, useEffect, useState } from 'react';
import { OrderContext, TracerContext } from '@context/index';
import AccountPanel from '@components/Trade/TradingPanel/AccountPanel';
import MarketSelect from '@components/Trade/TradingPanel/MarketSelect';
import PlaceOrder from './TradingPanel/PlaceOrder';
import styled from 'styled-components';
import TradingView from './RightPanel';
import { MARKET } from '@libs/types/OrderTypes';
import dynamic from 'next/dynamic';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { tourConfig } from './TourSteps';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useToasts } from 'react-toast-notifications';
import { Button } from '@components/General';
import { useCookies } from 'react-cookie';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';

const Tour = dynamic(import('reactour'), { ssr: false });

const Advanced: FC = styled(({ className }) => {
    const { addToast } = useToasts();
    const [isTourOpen, setTourOpen] = useState(false);
    const [tourCompleted, setTutorialCompleted] = useState(false);
    const [isAdjust] = useState(false);
    const { account } = useWeb3();
    const { order, orderDispatch = () => console.error('Order dispatch not set') } = useContext(OrderContext);
    const { selectedTracer } = useContext(TracerContext);
    const [cookies, setCookie] = useCookies(['tutorialIsComplete']);

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
        if (account) {
            triggerTutorial();
        }
    }, [account]);

    const triggerTutorial = async () => {
        // If cookie with flag does not exist,
        // start tutorial
        if (cookies.tutorialIsComplete !== 'true') {
            // eslint-disable-next-line react/jsx-key
            addToast(['Trading with Tracer', <ClickHere>Click here to learn how to trade with Tracer</ClickHere>], {
                appearance: 'info',
                autoDismiss: false,
            });
            // Get the toast notification element
            setTimeout(function () {
                const toast = document.querySelector('.notification-content') as HTMLDivElement;
                toast.addEventListener('click', function (e) {
                    const target = e.target as HTMLElement;
                    // If the target is the close button, do not run
                    if (!target.classList.contains('toast-close')) {
                        const closeButton = document.querySelector('.toast-close') as HTMLButtonElement;
                        closeButton.click();
                        setTourOpen(true);
                    }
                });
                listenForDismiss();
            }, 10);
        }
    };

    const setCookies = () => {
        if (cookies.tutorialIsComplete !== 'true') {
            setCookie('tutorialIsComplete', 'true', { path: '/' });
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
        if (cookies.tutorialIsComplete === 'true') {
            setTutorialCompleted(true);
        }
    };

    const setTutorialComplete = () => {
        closeTour();
    };

    const closeTour = () => {
        setTourOpen(false);

        // Reset the elements affected by the tour

        // Reset account dropdown button pointer events
        const accountDropdownButton = document.getElementById('account-dropdown-button');
        if (accountDropdownButton) {
            accountDropdownButton.style.pointerEvents = 'auto';
        }

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
        if (calculatorEl) {
            calculatorEl.removeAttribute('style');
        }
        if (marginModalEl) {
            marginModalEl.removeAttribute('style');
        }

        setCookies();
    };

    const highlightDots = (e: HTMLElement) => {
        // Wait for Reactour to apply class
        setTimeout(function () {
            const reactour = document.querySelector('.reactour__helper') as HTMLElement;
            reactour.addEventListener('click', function () {
                const navDots: Array<any> = Array.from(
                    document.querySelectorAll('nav[data-tour-elem="navigation"] button'),
                );
                const controls = document.querySelector('.helper [data-tour-elem="navigation"]') as HTMLDivElement;
                const rightButton = document.querySelector('.helper [data-tour-elem="right-arrow"]') as HTMLDivElement;

                // Wait for Reactour to apply styling
                setTimeout(function () {
                    navDots.map((dot, i) => {
                        const isActive = dot.classList.contains('reactour__dot--is-active');
                        if (i === navDots.length - 1 && isActive) {
                            controls.classList.add('hide');
                            rightButton.classList.add('hide');
                        } else {
                            controls.classList.remove('hide');
                            rightButton.classList.remove('hide');
                        }
                    });
                }, 10);
            });
            // Also prevent body scrolling when tour open
            disableBodyScroll(e);
        }, 10);
    };

    return (
        <>
            <div className={`container ${className}`}>
                <TradingPanel>
                    <MarketSelect />
                    <PlaceOrder selectedTracer={selectedTracer} account={account ?? ''} />
                    <AccountPanel selectedTracer={selectedTracer} account={account ?? ''} order={order} />
                    <MarketSelect account={account ?? ''} />
                    <TradeWrapper>
                        <PlaceOrder selectedTracer={selectedTracer} account={account ?? ''} />
                        <AccountPanel selectedTracer={selectedTracer} order={order} />
                        {!account ? <ConnectOverlay /> : null}
                    </TradeWrapper>
                </TradingPanel>
                <RightPanel>
                    <TradingView selectedTracer={selectedTracer} />
                </RightPanel>
                <Overlay id="trading-overlay" />
            </div>
            {!tourCompleted && (
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
                    lastStepNextButton={<FinishButton>Finish Tutorial</FinishButton>}
                />
            )}
        </>
    );
})`
    display: flex;
    height: 100%;
`;

export default Advanced;

const TradingPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    height: var(--height-content);
    border-left: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-bottom: 1px solid #0c3586;
`;

const TradeWrapper = styled.div`
    position: relative;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    height: var(--height-content);
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

const ClickHere = styled.div`
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

const FinishButton = styled(Button)`
    height: 32px;
    width: 153px;
    background: var(--color-accent);
    margin-left: -200px;
`;
