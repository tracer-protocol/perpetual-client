import React, { useContext } from 'react';
import { toApproxCurrency } from 'libs/utils';
import styled from 'styled-components';
import { Section } from '@components/General';
import PoolHealth from '@components/Insurance/PoolHealth';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import TooltipSelector from '@components/Tooltips/TooltipSelector';

export default styled(({ className }) => {
    const { poolInfo } = useContext(InsuranceContext);
    const poolHealth = poolInfo?.health ?? 0;
    return (
        <div className={className}>
            <h3>
                <TooltipSelector tooltip={{ key: 'insurance-pool-health' }}>Insurance Pool Health</TooltipSelector>
            </h3>
            <PoolHealth health={parseFloat(poolHealth.toFixed(2)) ?? defaults.health.toNumber()} />
            <Section
                label="Pool Holdings"
                tooltip={{
                    key: `pool-holdings`,
                    props: {
                        baseTicker: poolInfo?.market?.split('/')[0],
                    },
                }}
            >
                {toApproxCurrency(poolInfo?.liquidity ?? defaults.liquidity)}
            </Section>
            <Section
                label="Pool Target"
                tooltip={{
                    key: `pool-target`,
                    props: {
                        baseTicker: poolInfo?.market?.split('/')[0],
                    },
                }}
            >
                {toApproxCurrency(poolInfo?.target ?? defaults.target)}
            </Section>
            <Section
                label="Insurance Funding Rate"
                tooltip={{
                    key: `insurance-funding-rate`,
                    props: {
                        baseTicker: poolInfo?.market?.split('/')[0],
                    },
                }}
            >
                {/*TODO: Add insurance funding rate*/}
                0.001%
            </Section>
        </div>
    );
})`
    padding: 10px;
    h3 {
        font-size: var(--font-size-medium);
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
    }

    max-height: 25vh;
`;
