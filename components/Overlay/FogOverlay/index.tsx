import React, { FC } from 'react';
import Overlay from '@components/Overlay';
import styled from 'styled-components';
import { Button } from '@components/General';

interface FOProps {
    buttonName: string;
    onClick: () => void;
    show: boolean;
}
const FogOverlay: FC<FOProps> = ({ buttonName, onClick, show }: FOProps) => {
    return (
        <StyledOverlay show={show}>
            <ShowButton onClick={onClick}>{buttonName}</ShowButton>
        </StyledOverlay>
    );
};

export default FogOverlay;

const StyledOverlay = styled(Overlay)<{ show: boolean }>`
    display: ${(props) => (props.show ? 'flex' : 'none')};
`;

const ShowButton = styled(Button)`
    height: var(--height-small-button);
    padding: 0 15px;
    width: auto;
    min-width: 160px;
`;
