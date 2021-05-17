import React from 'react';
import { Children } from 'types';
import { FundingRateGraphic } from './';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

type SProps = {
    label: string;
    className?: string;
    tooltip?: React.ReactChild;
} & Children;

export const Section: React.FC<SProps> = styled(({ label, children, className, tooltip }: SProps) => {
    return tooltip ? (
        <Tooltip title={tooltip} placement="right">
            <div className={`${className}`}>
                <span className={`label`}>{label}</span>
                <span className={`content`}>{children}</span>
            </div>
        </Tooltip>
    ) : (
        <div className={`${className}`}>
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
    border-bottom: 1px solid #011772;
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
