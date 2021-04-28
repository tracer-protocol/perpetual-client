import React from 'react';
import ProgressBar from '@components/ProgressBar';
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
            <span className="label">{label}</span>
            {children ? <span className={`text-right w-full pl-4`}>{children}</span> : ''}
        </div>
    );
})`
    width: 100%;
    display: flex;
    margin: 10px 0;
    > .label {
        text-align: left;
        white-space: nowrap;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
        text-transform: capitalize;
    }
`;

export const FundingRate: React.FC<{ rate: number }> = ({ rate }: { rate: number }) => {
    return <FundingRateGraphic rate={rate} />;
};

/**
 *
 * @param health as an integer representation of a percentage
 * @returns
 */
export const PoolHealth: React.FC<{ health: number }> = ({ health }) => {
    return (
        <span className="w-3/4">
            <ProgressBar percent={health} />
        </span>
    );
};
