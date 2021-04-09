import React from 'react';
import LightWeightChart from '@components/Charts/LightWeightChart';

export const PnLInfo: React.FC = () => {
    return (
        <div className="px-5 border-t-2 h-full border-gray-100">
            <LightWeightChart />
        </div>
    );
};
