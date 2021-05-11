import React from 'react';
import { Children } from 'types';
import { FundingRateGraphic } from './';
import styled from 'styled-components';

type SProps = {
    label: string;
    classes?: string;
    className?: string;
} & Children;

export const Section: React.FC<SProps> = styled(({ label, classes, children, className }: SProps) => {
    return (
        <div className={`${classes} ${className}`}>
            <span className={`label`}>{label}</span>
            <span className={`content`}>{children}</span>
        </div>
    );
})`
    width: 100%;
    display: flex;
    margin: 10px 0;
    font-size: 16px;
    letter-spacing: -0.32px;
    > .label {
        text-align: left;
        white-space: nowrap;
        color: #3da8f5;
        text-transform: capitalize;
    }

    > .content {
        text-align: right;
        width: 100%;
        padding-left: 0.25rem;
    }
`;

export const FundingRate: React.FC<{ rate: number }> = ({ rate }: { rate: number }) => {
    return <FundingRateGraphic rate={rate} />;
};

