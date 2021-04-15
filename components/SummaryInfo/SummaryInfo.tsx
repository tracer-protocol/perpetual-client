import React from 'react';
import ProgressBar from '@components/ProgressBar';
import { Children } from 'types';
import { FundingRateGraphic } from './';

type SProps = {
    fontSize?: string;
    label: string;
} & Children;

export const Section: React.FC<SProps> = ({ fontSize, label, children }: SProps) => {
    return (
        <div className="w-full flex pt-1">
            <span className={`text-left w-1/2 ${fontSize ? fontSize : 'text-sm'}`}>{label}</span>
            {children ? <span className={`text-right w-1/2 ${fontSize ? fontSize : 'text-sm'}`}>{children}</span> : ''}
        </div>
    );
};

export const LiquidationPrice: React.FC = () => {
    return <div>X</div>;
};

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
