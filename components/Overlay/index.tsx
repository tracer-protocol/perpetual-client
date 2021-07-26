import React, { FC } from 'react';
import styled from 'styled-components';

interface OProps {
    className?: string;
    children?: React.ReactNode;
    id?: string;
}
const Overlay: FC<OProps> = styled(({ className, children, id }: OProps) => {
    return (
        <div className={className} id={id}>
            {children}
        </div>
    );
})`
    display: flex;
    background-color: var(--color-background);
    opacity: 0.8;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
`;

export default Overlay;
