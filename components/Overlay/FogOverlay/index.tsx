import React, { FC } from 'react';
import Overlay from '@components/Overlay';
import styled from 'styled-components';
import { Button } from '@components/General';

interface FOProps {
    buttonName: string;
    onClick: () => void;
}
const FogOverlay: FC<FOProps> = ({ buttonName, onClick }: FOProps) => {
    return (
        <Overlay>
            <ShowButton onClick={onClick}>{buttonName}</ShowButton>
        </Overlay>
    );
};

export default FogOverlay;

const ShowButton = styled(Button)`
    height: var(--height-small-button);
    padding: 0 15px;
    width: auto;
    min-width: 160px;
`;
