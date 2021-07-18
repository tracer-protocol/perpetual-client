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
const HelperText = styled.p`
    padding: 16px 16px;
    font-size: var(--font-size-small);
    pointer-events: none;
    margin-bottom: 6px;

    span {
        display: block;
        margin-bottom: 7px;
    }
`;

const HelperList = styled.ul`
    list-style: inherit;
    padding-inline-start: 16px;
`;

// const defaultStyles = {
//     backgroundColor: "var(--color-accent)",
//     color: "white",
//     padding: '0px',
//     overflow: 'hidden',
// };

export const tourConfig = [
    // Wallet button
    {
        selector: 'div[class^="AccountDropdown__MainButton"]',
        content: () => (
            <Prompt>
            <HelperTitle>Connect to Arbitrum</HelperTitle>
            <HelperText>
                Connect your wallet to Arbitrum Mainnet to get started with Tracer. 
            </HelperText>
            </Prompt>
        ),
        action: () => {
            const calculatorEl = document.querySelector('div[class*="Calculator"]') as HTMLElement;
            const marginModalEl = document.querySelector('div[class*="AccountModal"]') as HTMLElement;
            if(calculatorEl){
                calculatorEl.style.display = 'block';
            }
            if(marginModalEl){
                marginModalEl.style.display = 'block';
            }
        },
        position: 'bottom',
        style: {
            backgroundColor: "var(--color-accent)",
            color: "white",
            padding: '0px',
            overflow: 'hidden',
            left: '0px',
        }
    },
    // Calculator modal
    {
        selector: 'div[class*="Calculator"] .content',
        content: () => (
          <Prompt>
            <HelperTitle>Calculate Margin Required</HelperTitle>
            <HelperText>
                Use the calculator to see how much exposure and leverage you can get with your margin, and the price you'd be liquidated at. Once you've finished playing around, click 'Deposit'. 
            </HelperText>
          </Prompt>
        ),
        action: () => {
            const calcButton = document.querySelector('button[class*="Account__CalculatorButton"]') as HTMLElement;
            calcButton?.click();
        },
        position: 'left',
        style: {
            top: '100px',
            left: '-30px',
        }
    },
    // Margin modal
    {
        selector: 'div[class*="AccountModal"] .content',
        content: () => (
          <Prompt>
            <HelperTitle>Deposit Margin</HelperTitle>
            <HelperText>
                Depositing margin transfers funds from your wallet to your margin account. Tracer has market-isolated margin accounts: your position (and margin) in one market doesn't affect the accounts in others. 
            </HelperText>
          </Prompt>
        ),
        action: () => {
            const depositButton = document.querySelector('div[class^="Account__DepositButtons"]')?.firstChild as HTMLElement;
            const marginModalEl = document.querySelector('div[class*="AccountModal"]') as HTMLElement;
            depositButton?.click();
            if (marginModalEl) {
                marginModalEl.style.zIndex = '100000';
            }
        },
        position: 'left',
        style: {
            top: '70px',
            left: '-30px',
        }
    },
    // Market panel
    {
        selector: 'div[class*="PlaceOrder__StyledBox"]',
        content: () => (
          <Prompt>
            <HelperTitle>Open a Position</HelperTitle>
            <HelperText>
                <span>Once you've deposited margin, it's time to open a position by placing an order.</span>
                <span>You can get a position at the current best price (market order) or at a custom price (limit order).</span> 
                <HelperList>
                    <li>First, choose a side (long or short).</li>
                    <li>Then, enter the exposure you want and adjust it using the leverage bar.</li>
                    <li>Click 'Place Order'</li>
                </HelperList>
            </HelperText>
          </Prompt>
        ),
        action: () => {
            // Hide the margin modal after reaching next stage of tutorial
            const marginModalCloseButton = document.querySelector('div[class*="AccountModal"] span[class*="General__Close"') as HTMLElement;
            marginModalCloseButton?.click();
        },
        position: 'right',
        style: {
            left: '30px',
        }
    },
    // Position panel
    {
        selector: 'div[class*="AccountSummary"]',
        content: () => (
          <Prompt>
            <HelperTitle>Monitor Your Position</HelperTitle>
            <HelperText>
                <span>After your order is matched, you can see your position on the bottom menu. The position menu shows your profit and loss, position size, liquidation price and more.</span>
                <span>You can also monitor your position in the trading portfolio. Your trading portfolio gives other details like transaction history and transfers.</span> 
            </HelperText>
          </Prompt>
        ),
        action: () => {
            // Hide the 'No Position Open' overlay
            const positionOverlay = document.querySelector('div[class*="PositionOverlay__StyledOverlay"]') as HTMLElement;
            if (positionOverlay) {
                positionOverlay.style.display = 'none';
            }
        },
        position: 'top',
        style: {
            top: '-30px',
            left: '100px',
        }
    },
    // Adjust position panel
    {
        selector: '.AdjustPanel',
        content: () => (
          <Prompt>
            <HelperTitle>Adjust Your Position</HelperTitle>
            <HelperText>
                <span>Over time, your leverage can change. You can easily update and change your position with the leverage slider. The slider sits at your current leverage by default.</span>
                <span>Adjust it up or down to take on more or less exposure. Once you are happy, click ‘Place Order’ to update your position.</span> 
            </HelperText>
          </Prompt>
        ),
        position: 'right',
        style: {
            top: '-50px',
            left: '30px',
        }
    },
    // Close position button
    {
        selector: 'button[class*="OrderButtons__CloseOrder"]',
        content: () => (
          <Prompt>
            <HelperTitle>Adjust Your Position</HelperTitle>
            <HelperText>
                <span>Over time, your leverage can change. You can easily update and change your position with the leverage slider. The slider sits at your current leverage by default.</span>
                <span>Adjust it up or down to take on more or less exposure. Once you are happy, click ‘Place Order’ to update your position.</span> 
            </HelperText>
          </Prompt>
        ),
        action: () => {
            // Hide the 'No Position Open' overlay
            const closeOrderButton = document.querySelector('button[class*="OrderButtons__CloseOrder"]') as HTMLButtonElement;
            if (closeOrderButton) {
                closeOrderButton.disabled = false;
            }
        },
        position: 'top',
        style: {
            top: '-50px',
            left: '0px',
        }
    },
];