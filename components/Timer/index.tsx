import React from 'react';
import styled from 'styled-components';

const Timer: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <div id="refetchLoader" />
        </div>
    );
})`
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    z-index: -1;

    @keyframes countdown-width {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }

    #refetchLoader {
        animation: countdown-width 5s linear infinite;
        background: var(--color-accent);
        position: absolute;
        height: 0.25rem;
        right: 0;
    }
`;

export default Timer;
