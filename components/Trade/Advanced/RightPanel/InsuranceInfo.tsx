import React, { useContext } from 'react';
import { toApproxCurrency } from 'libs/utils';
import styled from 'styled-components';
import { Section } from '@components/General';
import PoolHealth from '@components/Insurance/PoolHealth';
import { InsuranceContext, defaults } from '@context/InsuranceContext';

export const InsuranceInfo: React.FC = styled(({ className }) => {
    const { poolInfo } = useContext(InsuranceContext);
    return (
        <div className={className}>
            <h3>Insurance Health</h3>
            <PoolHealth health={poolInfo?.health?.toNumber() ?? defaults.health.toNumber()} />
            <Section label={'Current Funding Level'}>{`${toApproxCurrency(
                poolInfo?.liquidity ?? defaults.liquidity,
            )}`}</Section>
            <Section label={'Target'}>{`${toApproxCurrency(poolInfo?.target ?? defaults.target)}`}</Section>
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
`;
