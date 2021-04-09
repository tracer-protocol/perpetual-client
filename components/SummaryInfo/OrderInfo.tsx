import React, { useContext } from 'react';
import { Section, LiquidationPrice, FundingRate, PoolHealth } from './';
import { TracerContext } from '@components/context';

export const OrderInfo: React.FC = () => {
    const { tracerInfo } = useContext(TracerContext);
    return (
        <>
            <Section label={'Margin Ratio'}></Section>
            <Section label={'Liquidation Price'}>
                <LiquidationPrice />
            </Section>
            <Section label={'Funding Rate'}>
                <FundingRate rate={tracerInfo?.fundingRate ?? 0} />
            </Section>
            <Section label={'Matching Fee'}>{tracerInfo?.matchingFee}</Section>
            <Section label={'Insurance Pool Health'}>
                <div className="m-auto">
                    <PoolHealth />
                </div>
            </Section>
            <Section label={'Order filling mechanism'}>AMM</Section>
        </>
    );
};
