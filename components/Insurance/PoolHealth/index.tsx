import React from 'react';
import ProgressBar from '@components/ProgressBar';

/**
 *
 * @param health as an integer representation of a percentage
 * @returns
 */
const PoolHealth: React.FC<{ health: number }> = ({ health }) => {
    return (
        <span className="w-3/4">
            <ProgressBar percent={health} />
        </span>
    );
};

export default PoolHealth;
export * from './Breakdown';