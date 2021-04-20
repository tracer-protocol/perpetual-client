import { InsuranceContext } from '@components/context';
import { toApproxCurrency } from '@components/libs/utils';
import React, { useContext } from 'react';
import { Section, PoolHealth } from './';

export const InsuranceInfo: React.FC = () => {
    const { poolInfo } = useContext(InsuranceContext);
    const health = (poolInfo?.liquidity ?? 0) / (poolInfo?.target ?? 0); 
    return (
        <>
            <Section label={'Insurance Pool Health'}>
                <div className="m-auto">
                    <PoolHealth health={health ?? 100} />
                </div>
            </Section>
            <Section label={'Current Funding Level'} >
                {`${toApproxCurrency(poolInfo?.liquidity ?? 0)}`}
            </Section>
            <Section label={'Target'}>
                {`${toApproxCurrency(poolInfo?.target ?? 0)}`}
            </Section>
        </>
    )
}