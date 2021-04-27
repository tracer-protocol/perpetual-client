import { InsuranceContext } from '@components/context';
import { toApproxCurrency } from '@components/libs/utils';
import React, { useContext } from 'react';
import styled from 'styled-components'
import { Section, PoolHealth } from './';

export const InsuranceInfo: React.FC = styled(({ className }) => {
    const { poolInfo } = useContext(InsuranceContext);
    return (
        <div className={className}>
            <h3>
                Insurance Health
            </h3>
            <PoolHealth health={poolInfo?.health ?? 0} />
            <Section label={'Current Funding Level'} >
                {`${toApproxCurrency(poolInfo?.liquidity ?? 0)}`}
            </Section>
            <Section label={'Target'}>
                {`${toApproxCurrency(poolInfo?.target ?? 0)}`}
            </Section>
        </div>
    )
})`
    padding: 10px;
    h3 {
        font-size: 20px;
        letter-spacing: -0.4px;
        color: #FFFFFF;
        text-transform: capitalize;
    }

`