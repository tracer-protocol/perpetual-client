import React, { FC } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';

const StyledOverlay = styled(Overlay)`
    font-size: var(--font-size-medium);
    background-color: var(--color-background-secondary);
`;

const PositionOverlay: FC = () => {
    return <StyledOverlay>No Open Position.</StyledOverlay>;
};

export default PositionOverlay;
