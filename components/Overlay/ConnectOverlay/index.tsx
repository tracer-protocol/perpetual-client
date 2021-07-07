import React, { useContext } from 'react';
import styled from 'styled-components';
import { Web3Context } from '@context/Web3Context';

const ConnectOverlay: React.FC = styled(({ className }) => {
    const { handleConnect } = useContext(Web3Context);
    return (
        <div className={className}>
            <OverlayContent>
                <ConnectText>No wallet connected.</ConnectText>
                <ConnectButton
                    onClick={() => (handleConnect ? handleConnect() : console.error('Connect button is undefined'))}
                >
                    Connect Wallet
                </ConnectButton>
            </OverlayContent>
        </div>
    );
})`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-background-secondary);
    opacity: 0.8;
    z-index: 3;
`;

const OverlayContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const ConnectText = styled.div`
    font-size: var(--font-size-medium);
    color: var(--color-text);
`;

const ConnectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-small);
    border: 2px solid #fff;
    border-radius: 100px;
    width: 160px;
    height: 40px;
    transition: 0.2s;
    padding: 0 10px;
    margin-top: 10px;

    &:focus {
        outline: none;
    }

    &:hover {
        background: var(--color-primary);
    }
`;

export default ConnectOverlay;
