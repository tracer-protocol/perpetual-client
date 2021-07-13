import React, { FC, useContext, useState } from 'react';
import { toApproxCurrency } from 'libs/utils';
import styled from 'styled-components';
import { ProgressBar, Section } from '@components/General';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import BigNumber from 'bignumber.js';
import FogOverlay from '@components/Overlay/FogOverlay';

interface IIProps {
    className?: string;
    fundingRate: BigNumber;
}
const InsuranceInfo: FC<IIProps> = styled(({ className, fundingRate }: IIProps) => {
    const { poolInfo } = useContext(InsuranceContext);
    const poolHealth = poolInfo?.health ?? defaults.health;
    const poolLiquidity = poolInfo?.liquidity ?? defaults.liquidity;
    const poolTarget = poolInfo?.target ?? defaults.target;
    const [showOverlay, setOverlay] = useState(true);

    return (
        <div className={className}>
            <InfoContent>
                <InfoTitle>
                    <TooltipSelector tooltip={{ key: 'insurance-pool-health' }}>Insurance Pool Health</TooltipSelector>
                </InfoTitle>
                <ProgressBar percent={parseFloat(poolHealth.toFixed(2)) ?? defaults.health} />
                <Section
                    label="Pool Holdings"
                    tooltip={{
                        key: `pool-holdings`,
                        props: {
                            baseTicker: poolInfo?.market?.split('/')[0],
                        },
                    }}
                >
                    {toApproxCurrency(poolLiquidity ?? defaults.liquidity)}
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
                    {toApproxCurrency(poolTarget ?? defaults.target)}
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
                    {(fundingRate.toNumber() * 100).toFixed(5)}%
                </Section>
            </InfoContent>
            {showOverlay ? <FogOverlay buttonName="Show Insurance Health" onClick={() => setOverlay(false)} /> : null}
        </div>
    );
})`
    position: relative;
    max-height: 25vh;
`;

export default InsuranceInfo;

const InfoContent = styled.div`
    padding: 10px;
`;

const InfoTitle = styled.div`
    font-size: var(--font-size-small-heading);
    letter-spacing: -0.4px;
    color: #ffffff;
    text-transform: capitalize;
`;
