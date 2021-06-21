import React from 'react';
import { ProgressBar } from '@components/General';

/**
 *
 * @param health as an integer representation of a percentage
 * @returns
 */
const PoolHealth: React.FC<{ health: number }> = ({ health }) => {
    return <ProgressBar percent={health} />;
};

export default PoolHealth;
export * from './Breakdown';
