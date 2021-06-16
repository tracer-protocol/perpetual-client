import React, { useContext } from 'react';
import { toApproxCurrency } from 'libs/utils';
import styled from 'styled-components';
import { Section } from '@components/General';
import PoolHealth from '@components/Insurance/PoolHealth';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import { InsuranceFundingRateTip, InsurancePoolHealthTip, PoolHoldingsTip, PoolTargetTip } from '@components/Tooltips';

export default styled(({ className }) => {
    const { poolInfo } = useContext(InsuranceContext);
    return (
        <div className={className}>
            <h3>
                <a data-tip="" data-for="insurance-pool-health">
                    Insurance Pool Health
                </a>
                <InsurancePoolHealthTip />
            </h3>
            <PoolHealth health={poolInfo?.health?.toNumber() ?? defaults.health.toNumber()} />
            <Section label={'Pool Holdings'} slug={`pool-holdings`}>
                {toApproxCurrency(poolInfo?.liquidity ?? defaults.liquidity)}
            </Section>
            <PoolHoldingsTip base={poolInfo?.market?.split('/')[0]} />
            <Section label={'Pool Target'} slug={`pool-target`}>
                {toApproxCurrency(poolInfo?.target ?? defaults.target)}
            </Section>
            <PoolTargetTip base={poolInfo?.market?.split('/')[0]} />
            <Section label={'Insurance Funding Rate'} slug={`insurance-funding-rate`}>
                0.001%
            </Section>
            <InsuranceFundingRateTip base={poolInfo?.market?.split('/')[0]} />
        </div>
    );
})`
    padding: 10px;

    h3 {
        font-size: 20px;
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
    }

    max-height: 25vh;
`;
