import React from 'react';
import { Section, FundingRate } from './';
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
            <Section label={'Funding Rate'} classes={'text-lg'}>
                <FundingRate rate={fundingRate} />
            </Section>
            <Section label={'Insurance Pool Health'} classes={'text-lg'}>
                <PoolHealth health={health} />
            </Section>
        </div>
    );
};
