import React, { FC } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';

const PlaceOrderOverlay: FC = () => {
    return (
        <StyledOverlay>
            <OverlayTitle>No Margin Deposited.</OverlayTitle>
        </StyledOverlay>
    );
};

export default PlaceOrderOverlay;

const StyledOverlay = styled(Overlay)`
    background-color: var(--color-background-secondary);
`;

const OverlayTitle = styled.div`
    font-size: var(--font-size-medium);
`;
