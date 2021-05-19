import React from 'react';
import { Section } from '@components/General';
import { FundingRateGraphic } from './FundingRateGraphic';
import TracerLoading from '@components/TracerLoading';
import PoolHealth from '@components/Insurance/PoolHealth';

type MIProps = {
    fundingRate: number;
    health: number;
};

export const MarketInfo: React.FC<MIProps> = ({ fundingRate, health }: MIProps) => {
    return fundingRate !== 0 ? (
        <TracerLoading />
    ) : (
        <div className="px-5 border-t-2 h-full border-gray-100">
            <Section label={'Funding Rate'}>
                <FundingRateGraphic rate={fundingRate} />
            </Section>
            <Section label={'Insurance Pool Health'}>
                <PoolHealth health={health} />
            </Section>
        </div>
    );
};
