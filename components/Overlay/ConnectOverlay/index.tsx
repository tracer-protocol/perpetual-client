import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { Web3Context } from '@context/Web3Context';
import Overlay from '@components/Overlay';

const ConnectOverlay: FC = () => {
    const { handleConnect } = useContext(Web3Context);
    return (
        <StyledOverlay>
            No wallet connected.
            <ConnectButton
                onClick={() => (handleConnect ? handleConnect() : console.error('Connect button is undefined'))}
            >
                Connect Wallet
            </ConnectButton>
        </StyledOverlay>
    );
};

const StyledOverlay = styled(Overlay)`
    font-size: var(--font-size-medium);
    background-color: var(--color-background-secondary);
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
