import React from 'react';
import styled from 'styled-components';
import { Errors } from '@context/OrderContext';

type EProps = {
    className?: string;
    error: number;
    message?: string; // this will override the rror message
};
const Error: React.FC<EProps> = styled(({ className, error, message }: EProps) => {
    const _message = message ?? error !== -1 ? Errors[error].message : '';
    return <div className={`${className} ${error !== -1 || !!message ? 'show' : ''}`}>
        <div className="message">
            {_message}
        </div>
    </div>;
})`
    background: #f15025;
    border-radius: 0px 0px 5px 5px;
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #ffffff;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(0);
    transition: all 0.4s;
    opacity: 0;
    z-index: -1;
    &.show {
        opacity: 1;
        z-index: 1;
        transform: translateY(100%);
    }

    .message {
        transition: all 0.4s;
        margin: 0px;
    }
    &.show .message {
        margin: 10px;
    }
`;

export default Error;
