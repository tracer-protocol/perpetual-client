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
    width: calc(100% - 120px);
    position: absolute;
    left: 120px;
    z-index: -1;

    @keyframes countdown-width {
        from {
            width: 0%;
        }
        to {
            width: 100%;
        }
    }

    #refetchLoader {
        animation: countdown-width 5s linear infinite;
        background: #011772;
        position: absolute;
        height: 0.25rem;
        left: 0;
    }
`;

export default Timer;
