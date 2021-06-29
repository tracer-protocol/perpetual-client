import React, { useContext } from 'react';
import { toApproxCurrency } from 'libs/utils';
import styled from 'styled-components';
import { Section } from '@components/General';
import PoolHealth from '@components/Insurance/PoolHealth';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import TooltipSelector from '@components/Tooltips/TooltipSelector';

export default styled(({ className }) => {
    const { poolInfo } = useContext(InsuranceContext);
    const poolHealth = poolInfo?.health ?? defaults.health;
    const poolLiquidity = poolInfo?.liquidity ?? defaults.liquidity;
    const poolTarget = poolInfo?.target ?? defaults.target;
    return (
        <div className={className}>
            <h3>
                <TooltipSelector tooltip={{ key: 'insurance-pool-health' }}>Insurance Pool Health</TooltipSelector>
            </h3>
            <PoolHealth health={parseFloat(poolHealth.toFixed(2)) ?? defaults.health} />
            <Section
                label="Pool Holdings"
                tooltip={{
                    key: `pool-holdings`,
                    props: {
                        baseTicker: poolInfo?.market?.split('/')[0],
                    },
                }}
            >
                {toApproxCurrency(parseFloat(poolLiquidity.toFixed(2)) ?? defaults.liquidity)}
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
                {toApproxCurrency(parseFloat(poolTarget.toFixed(2)) ?? defaults.target)}
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
                0.00%
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
