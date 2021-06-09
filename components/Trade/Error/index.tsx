import React from 'react';
import styled from 'styled-components';
import { Errors } from '@context/OrderContext';

type EProps = {
    className?: string;
    error: number;
    message?: string; // this will override the rror message
};
const Error: React.FC<EProps> = styled(({ className, error, message }: EProps) => {
    console.log(error);
    const _message = message ?? error !== -1 ? Errors[error].message : '';
    return <div className={`${className} ${error !== -1 || !!message ? 'show' : ''}`}>{_message}</div>;
})`
    background: #f15025;
    border-radius: 0px 0px 5px 5px;
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #ffffff;
    text-align: center;
    position: absolute;
    padding: 10px;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(100%);
    transition: all 0.4s ease-in-out;
    opacity: 0;
    &.show {
        opacity: 1;
    }
`;

export default Error;
