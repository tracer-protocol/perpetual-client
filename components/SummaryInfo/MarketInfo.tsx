import React from 'react';
import { Section, FundingRate, PoolHealth } from './';
import TracerLoading from '@components/TracerLoading';

type MIProps = {
    fundingRate: number;
};

export const MarketInfo: React.FC<MIProps> = ({ fundingRate }: MIProps) => {
    return fundingRate !== 0 ? (
        <TracerLoading />
    ) : (
        <div className="px-5 border-t-2 h-full border-gray-100">
            <Section label={'Funding Rate'} fontSize={'text-lg'}>
                <FundingRate rate={fundingRate} />
            </Section>
            <Section label={'Insurance Pool Health'} fontSize={'text-lg'}>
                <PoolHealth health={80}/>
            </Section>
        </div>
    );
};
