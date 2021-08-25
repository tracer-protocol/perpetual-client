import React from 'react';
import styled from 'styled-components';

const Prompt = styled.div`
    background: var(--color-accent);
`;
const HelperTitle = styled.span`
    display: flex;
    align-items: center;
    height: 57px;
    padding: 0 16px;
    font-size: var(--font-size-large);
    border-bottom: 1px solid var(--color-background-secondary);
    pointer-events: none;
`;

interface HTextProps {
    noPadding?: boolean;
}
const HelperText = styled.p<HTextProps>`
    padding: ${(props) => (props.noPadding ? '16px 16px 0' : '16px 16px')};
    font-size: var(--font-size-small);
    pointer-events: none;
    margin-bottom: 8px;

    span {
        display: block;
        margin-bottom: 8px;
    }
`;

const HelperList = styled.ul`
    font-size: var(--font-size-small);
    list-style: inherit;
    padding: 0 16px 16px 32px;
    pointer-events: none;
`;

export const tourConfig = [
    // Wallet button
    {
        selector: '#account-dropdown',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Connect to Arbitrum</HelperTitle>
                    <HelperText>Connect your wallet to Arbitrum Mainnet to get started with Tracer.</HelperText>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            const accountDropdownButton = document.getElementById('account-dropdown-button');
            if (accountDropdownButton) {
                accountDropdownButton.style.pointerEvents = 'none';
            }

            const calculatorEl = document.getElementById('calculator-modal') as HTMLElement;
            if (calculatorEl) {
                calculatorEl.style.display = 'block';
            }

            const marginModalEl = document.getElementById('account-modal') as HTMLElement;
            if (marginModalEl) {
                marginModalEl.style.display = 'block';
            }

            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            if (calculatorButton) {
                calculatorButton.style.zIndex = '0';
            }

            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            if (depositButton) {
                depositButton.style.zIndex = '0';
            }
        },
        position: 'bottom',
        style: {
            top: '50px',
            left: '0px',
        },
    },
    // Calculator modal
    {
        selector: '#calculator-modal .content',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Calculate Margin Required</HelperTitle>
                    <HelperText>
                        Use the calculator to see how much exposure and leverage you can get with your margin, and the
                        price you’d be liquidated at. Once you’ve finished playing around, click ‘Deposit’.
                    </HelperText>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            calculatorButton.click();
            if (calculatorButton) {
                calculatorButton.style.zIndex = '1000000';
            }
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            if (depositButton) {
                depositButton.style.zIndex = '0';
            }
        },
        position: 'left',
        style: {
            top: '100px',
            left: '-30px',
        },
    },
    // Margin modal
    {
        selector: '#account-modal .content',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Deposit Margin</HelperTitle>
                    <HelperText>
                        Depositing margin transfers funds from your wallet to your margin account. Tracer has
                        market-isolated margin accounts: your position (and margin) in one market doesn’t affect the
                        accounts in others.
                    </HelperText>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            if (calculatorButton) {
                calculatorButton.style.zIndex = '0';
            }
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            depositButton?.click();
            if (depositButton) {
                depositButton.style.zIndex = '1000000';
            }
        },
        position: 'left',
        style: {
            top: '70px',
            left: '-30px',
        },
    },
    // Open position
    {
        selector: '#open-position',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Open a Position</HelperTitle>
                    <HelperText noPadding>
                        <span>Once you’ve deposited margin, it’s time to open a position by placing an order.</span>
                        <span>
                            You can get a position at the current best price (market order) or at a custom price (limit
                            order).
                        </span>
                    </HelperText>
                    <HelperList>
                        <li>First, choose a side (long or short).</li>
                        <li>Then, enter the exposure you want and adjust it using the leverage bar.</li>
                        <li>Click ‘Place Order’</li>
                    </HelperList>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            // Hide the margin modal after reaching next stage of tutorial
            const marginModalCloseButton = document.querySelector(
                '#account-modal span[class*="General__Close"]',
            ) as HTMLElement;
            marginModalCloseButton?.click();
            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            if (calculatorButton) {
                calculatorButton.style.zIndex = '0';
            }
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            if (depositButton) {
                depositButton.style.zIndex = '0';
            }
        },
        position: 'right',
        style: {
            left: '30px',
        },
    },
    // Monitor position
    {
        selector: '#account-summary-panel',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Monitor Your Position</HelperTitle>
                    <HelperText>
                        <span>
                            After your order is matched, you can see your position on the bottom menu. The position menu
                            shows your profit and loss, position size, liquidation price and more.
                        </span>
                        <span>
                            You can also monitor your position in the trading portfolio. Your trading portfolio gives
                            other details like transaction history and transfers.
                        </span>
                    </HelperText>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            // Hide the 'No Position Open' overlay
            const positionOverlay = document.getElementById('position-overlay') as HTMLElement;
            if (positionOverlay) {
                positionOverlay.style.display = 'none';
            }
            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            if (calculatorButton) {
                calculatorButton.style.zIndex = '0';
            }
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            if (depositButton) {
                depositButton.style.zIndex = '0';
            }
        },
        position: 'top',
        style: {
            top: '-30px',
            left: '100px',
        },
    },
    // Adjust position
    {
        selector: '#adjust-position',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Adjust Your Position</HelperTitle>
                    <HelperText>
                        <span>
                            Over time, your leverage can change. You can easily update and change your position with the
                            leverage slider. The slider sits at your current leverage by default.
                        </span>
                        <span>
                            Adjust it up or down to take on more or less exposure. Once you are happy, click ‘Place
                            Order’ to update your position.
                        </span>
                    </HelperText>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            if (calculatorButton) {
                calculatorButton.style.zIndex = '0';
            }
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            if (depositButton) {
                depositButton.style.zIndex = '0';
            }
        },
        position: 'right',
        style: {
            top: '-50px',
            left: '30px',
        },
    },
    // Close position
    {
        selector: '#position-close-container',
        // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
        content: () => {
            return (
                <Prompt>
                    <HelperTitle>Close Position</HelperTitle>
                    <HelperText>
                        <span>If you’re done trading, click ‘Close Position’.</span>
                        <span>You’ll be given a market order that is exactly opposite to the one you hold.</span>
                        <span>Click ‘Place Order’. Once this order is matched, your position will be closed.</span>
                    </HelperText>
                </Prompt>
            );
        },
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        action: () => {
            const calculatorButton = document.getElementById('calculator-button') as HTMLElement;
            if (calculatorButton) {
                calculatorButton.style.zIndex = '0';
            }
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            if (depositButton) {
                depositButton.style.zIndex = '0';
            }
        },
        position: 'top',
        style: {
            top: '-50px',
            left: '0px',
        },
    },
];
