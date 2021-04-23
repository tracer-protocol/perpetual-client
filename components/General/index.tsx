import React from 'react';
import styled from 'styled-components';

export const Box: React.FC<{ className?: string }> = styled.div`
    border: 2px solid #0C3586;
    display: flex;
    padding: 20px;
`

export const Button: React.FC<{ className?: string }> = styled.div`

    transition: 0.3s;
    color: #3DA8F5;
    font-size: 16px;
    letter-spacing: -0.32px;
    border: 1px solid #3DA8F5;
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: 160px;

    &:hover {
        cursor:pointer;
        background: #3DA8F5;
        color: #fff;
    }

    &.primary {
        background: #3DA8F5;
        color: #fff;
    }

    &.primary:hover {
        background: #03065E;
        color: #3DA8F5;
    }
`