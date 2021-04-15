import React, { useContext } from 'react';
import { Section, LiquidationPrice, FundingRate, PoolHealth } from './';
import { InsuranceContext, TracerContext } from '@components/context';

export const OrderInfo: React.FC = () => {
    const { selectedTracer } = useContext(TracerContext);
    const { health } = useContext(InsuranceContext);
    return (
        <>
            <Section label={'Margin Ratio'}></Section>
            <Section label={'Liquidation Price'}>
                <LiquidationPrice />
            </Section>
            <Section label={'Funding Rate'}>
                <FundingRate rate={selectedTracer?.feeRate ?? 0} />
            </Section>
            <Section label={'Insurance Pool Health'}>
                <div className="m-auto">
                    <PoolHealth health={health ?? 100} />
                </div>
            </Section>
            <Section label={'Order filling mechanism'}>AMM</Section>
        </>
    );
};
