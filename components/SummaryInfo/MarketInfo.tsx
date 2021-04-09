import React from 'react';
import { Section, FundingRate, PoolHealth } from './';
import TracerLoading from '@components/TracerLoading';

type MIProps = {
    fundingRate: number;
};

export const MarketInfo: React.FC<MIProps> = ({ fundingRate }: MIProps) => {
    return !fundingRate ? (
        <TracerLoading />
    ) : (
        <div className="px-5 border-t-2 h-full border-gray-100">
            <Section label={'Funding Rate'} fontSize={'text-lg'}>
                <FundingRate rate={fundingRate} />
            </Section>
            <Section label={'Insurance Pool Health'} fontSize={'text-lg'}>
                <PoolHealth />
            </Section>
            <Section label={'High'} fontSize={'text-lg'}>
                XX
            </Section>
            <Section label={'Low'} fontSize={'text-lg'}>
                XX
            </Section>
            <Section label={'Open'} fontSize={'text-lg'}>
                XX
            </Section>
        </div>
    );
};
