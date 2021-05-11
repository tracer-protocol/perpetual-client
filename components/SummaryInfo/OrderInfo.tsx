import React from 'react';
import { Section, FundingRate } from './';
import PoolHealth from '@components/Insurance/PoolHealth';

export const OrderInfo: React.FC<{
    feeRate: number | undefined;
    health: number | undefined;
    engine: 'AMM' | 'OME' | undefined;
}> = ({ feeRate, health, engine }) => {
    return (
        <>
            <Section label={'Funding Rate'}>
                <FundingRate rate={feeRate ?? 0} />
            </Section>
            <Section label={'Insurance Pool Health'}>
                <div className="m-auto">
                    <PoolHealth health={health ?? 100} />
                </div>
            </Section>
            <Section label={'Order filling mechanism'}>{engine}</Section>
        </>
    );
};
