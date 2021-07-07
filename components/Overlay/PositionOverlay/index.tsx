import React from 'react';
import styled from 'styled-components';

const PositionOverlay = styled(({ className }) => {
    return <div className={className}>No Open Position.</div>;
})`
    display: flex;
    background-color: var(--color-background-secondary);
    opacity: 0.8;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: var(--font-size-medium);
    z-index: 3;
`;

export default PositionOverlay;
