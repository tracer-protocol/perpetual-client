import React, { FC } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';

const PositionOverlay: FC = () => {
    return (
        <StyledOverlay id="position-overlay">
            <OverlayTitle>No Open Position.</OverlayTitle>
        </StyledOverlay>
    );
};

export default PositionOverlay;

const StyledOverlay = styled(Overlay)`
    background-color: var(--color-background-secondary);
`;

const OverlayTitle = styled.div`
    font-size: var(--font-size-medium);
`;
