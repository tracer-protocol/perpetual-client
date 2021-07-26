import React from 'react';
import styled from 'styled-components';

const Prompt = styled.div`
    background: var(--color-accent);
`;
const HelperTitle = styled.span`
    display: flex;
    align-items: center;
    height: 57px;
    padding: 0px 16px;
    font-size: var(--font-size-large);
    border-bottom: 1px solid var(--color-background-secondary);
    pointer-events: none;
`;

interface HTextProps {
    noPadding?: boolean;
}
const HelperText = styled.p<HTextProps>`
    padding: ${(props) => (props.noPadding ? '16px 16px 0px' : '16px 16px')};
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
    padding: 0px 16px 16px 32px;
    pointer-events: none;
`;

export const tourConfig = [
    // Wallet button
    {
        selector: '#account-dropdown',
        content: () => (
            <Prompt>
                <HelperTitle>Connect to Arbitrum</HelperTitle>
                <HelperText>Connect your wallet to Arbitrum Mainnet to get started with Tracer.</HelperText>
            </Prompt>
        ),
        action: () => {
            const calculatorEl = document.getElementById('calculator-modal') as HTMLElement;
            const marginModalEl = document.getElementById('account-modal') as HTMLElement;
            const navbar = document.getElementById('nav') as HTMLElement;

            if (calculatorEl) {
                calculatorEl.style.display = 'block';
            }
            if (marginModalEl) {
                marginModalEl.style.display = 'block';
            }
            if (navbar) {
                calculatorEl.style.zIndex = '1000000';
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
        content: () => (
            <Prompt>
                <HelperTitle>Calculate Margin Required</HelperTitle>
                <HelperText>
                    Use the calculator to see how much exposure and leverage you can get with your margin, and the price
                    you'd be liquidated at. Once you've finished playing around, click 'Deposit'.
                </HelperText>
            </Prompt>
        ),
        action: () => {
            const calcButton = document.getElementById('calc-button') as HTMLElement;
            calcButton?.click();
            const marginModalEl = document.getElementById('account-modal') as HTMLElement;
            const calculatorEl = document.getElementById('calculator-modal') as HTMLElement;
            if (calculatorEl) {
                calculatorEl.style.zIndex = '100001';
            }
            if (marginModalEl) {
                marginModalEl.style.zIndex = '100000';
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
        content: () => (
            <Prompt>
                <HelperTitle>Deposit Margin</HelperTitle>
                <HelperText>
                    Depositing margin transfers funds from your wallet to your margin account. Tracer has
                    market-isolated margin accounts: your position (and margin) in one market doesn't affect the
                    accounts in others.
                </HelperText>
            </Prompt>
        ),
        action: () => {
            const calculatorEl = document.getElementById('calculator-modal') as HTMLElement;
            const marginModalEl = document.getElementById('account-modal') as HTMLElement;
            const depositButton = document.getElementById('deposit-button') as HTMLElement;
            depositButton?.click();
            if (calculatorEl) {
                calculatorEl.style.zIndex = '100000';
            }
            if (marginModalEl) {
                marginModalEl.style.zIndex = '100001';
            }
        },
        position: 'left',
        style: {
            top: '70px',
            left: '-30px',
        },
    },
    // Market panel
    {
        selector: '#adjustment-container',
        content: () => (
            <Prompt>
                <HelperTitle>Open a Position</HelperTitle>
                <HelperText noPadding>
                    <span>Once you've deposited margin, it's time to open a position by placing an order.</span>
                    <span>
                        You can get a position at the current best price (market order) or at a custom price (limit
                        order).
                    </span>
                </HelperText>
                <HelperList>
                    <li>First, choose a side (long or short).</li>
                    <li>Then, enter the exposure you want and adjust it using the leverage bar.</li>
                    <li>Click 'Place Order'</li>
                </HelperList>
            </Prompt>
        ),
        action: () => {
            // Hide the margin modal after reaching next stage of tutorial
            const marginModalCloseButton = document.querySelector(
                '#account-modal span[class*="General__Close"',
            ) as HTMLElement;
            marginModalCloseButton?.click();
        },
        position: 'right',
        style: {
            left: '30px',
        },
    },
    // Position panel
    {
        selector: '#position-panel',
        content: () => (
            <Prompt>
                <HelperTitle>Monitor Your Position</HelperTitle>
                <HelperText>
                    <span>
                        After your order is matched, you can see your position on the bottom menu. The position menu
                        shows your profit and loss, position size, liquidation price and more.
                    </span>
                    <span>
                        You can also monitor your position in the trading portfolio. Your trading portfolio gives other
                        details like transaction history and transfers.
                    </span>
                </HelperText>
            </Prompt>
        ),
        action: () => {
            // Hide the 'No Position Open' overlay
            const positionOverlay = document.getElementById('position-overlay') as HTMLElement;
            if (positionOverlay) {
                positionOverlay.style.display = 'none';
            }
        },
        position: 'top',
        style: {
            top: '-30px',
            left: '100px',
        },
    },
    // Adjust position panel
    {
        selector: '#order-panel',
        content: () => (
            <Prompt>
                <HelperTitle>Adjust Your Position</HelperTitle>
                <HelperText>
                    <span>
                        Over time, your leverage can change. You can easily update and change your position with the
                        leverage slider. The slider sits at your current leverage by default.
                    </span>
                    <span>
                        Adjust it up or down to take on more or less exposure. Once you are happy, click 'Place Order'
                        to update your position.
                    </span>
                </HelperText>
            </Prompt>
        ),
        position: 'right',
        style: {
            top: '-50px',
            left: '30px',
        },
    },
    // Close position button
    {
        selector: '#close-order-button',
        content: () => (
            <Prompt>
                <HelperTitle>Close Position</HelperTitle>
                <HelperText>
                    <span>If you're done trading, click 'Close Position'.</span>
                    <span>You'll be given a market order that is exactly opposite to the one you hold.</span>
                    <span>Click 'Place Order'. Once this order is matched, your position will be closed.</span>
                </HelperText>
            </Prompt>
        ),
        action: () => {
            // Enable the close order button
            const closeOrderButton = document.getElementById('position-close-container') as HTMLButtonElement;
            if (closeOrderButton) {
                closeOrderButton.disabled = false;
            }
        },
        position: 'top',
        style: {
            top: '-50px',
            left: '0px',
        },
    },
];
