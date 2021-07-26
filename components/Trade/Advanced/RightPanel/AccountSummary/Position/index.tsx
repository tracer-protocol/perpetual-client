import React, { FC, useContext, useState } from 'react';
import { OrderContext, orderDefaults } from '@context/OrderContext';
import { BigNumber } from 'bignumber.js';
import { toApproxCurrency } from '@libs/utils';
import { calcLiquidationPrice, calcUnrealised } from '@tracer-protocol/tracer-utils';
import { CloseOrderButton } from '@components/OrderButtons';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import PositionOverlay from '@components/Overlay/PositionOverlay';
import { LineData, UserBalance } from '@libs/types/TracerTypes';
import { FilledOrder } from '@libs/types/OrderTypes';
import styled from 'styled-components';
import { Previous, Section } from '@components/General';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import Side from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Side';
import Leverage from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Leverage';
import Exposure from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Exposure';
import LightWeightChart from '@components/Charts/LightWeightLineChart';
import { useLines } from '@libs/Graph/hooks/Tracer';
import { TracerContext } from '@context/TracerContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';

interface PTProps {
    className?: string;
    balances: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    baseTicker: string;
    quoteTicker: string;
    filledOrders: FilledOrder[];
}

const PositionTab: FC<PTProps> = styled(
    ({ className, balances, fairPrice, maxLeverage, baseTicker, quoteTicker, filledOrders }: PTProps) => {
        const [currency, setCurrency] = useState(0); // 0 quoted in base
        const { account } = useWeb3();
        const { order } = useContext(OrderContext);
        const { base } = balances;
        const { selectedTracer } = useContext(TracerContext);
        const { lines } = useLines(selectedTracer?.address ?? '');
        const liquidationPrice = calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage);

        return (
            <div className={className} id="position-panel">
                <PositionInfo>
                    <PositionDetails>
                        <DetailsRow>
                            <DetailsSection label="Side" className="w-1/2">
                                <Side
                                    balances={balances}
                                    nextPosition={
                                        order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }
                                    }
                                    tradePrice={order?.price ?? 0}
                                    exposure={order?.exposure ?? 0}
                                />
                            </DetailsSection>
                            <DetailsSection
                                label="Unrealised PnL"
                                className="w-1/2"
                                tooltip={{ key: 'unrealised-pnl', props: { baseTicker: baseTicker } }}
                            >
                                {!balances.quote.eq(0) ? (
                                    <Content>
                                        {toApproxCurrency(calcUnrealised(base, fairPrice, filledOrders), 3)}
                                    </Content>
                                ) : (
                                    '-'
                                )}
                            </DetailsSection>
                        </DetailsRow>

                        <DetailsRow>
                            <DetailsSection label="Leverage" className="w-1/2">
                                <Leverage
                                    balances={balances}
                                    nextPosition={
                                        order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }
                                    }
                                    tradePrice={order?.price ?? 0}
                                    fairPrice={fairPrice}
                                    orderType={order?.orderType ?? 0}
                                    exposure={order?.exposure ?? 0}
                                />
                            </DetailsSection>
                            <DetailsSection
                                label="Realised PnL"
                                className="w-1/2"
                                tooltip={{ key: 'realised-pnl', props: { baseTicker: baseTicker } }}
                            >
                                -
                            </DetailsSection>
                        </DetailsRow>
                        <DetailsSection
                            label={'Exposure'}
                            className="w-full"
                            tooltip={{ key: 'exposure', props: { baseTicker: baseTicker } }}
                        >
                            <Exposure
                                balances={balances}
                                fairPrice={fairPrice}
                                currency={currency}
                                order={order ?? orderDefaults.order}
                                quoteTicker={quoteTicker}
                                baseTicker={baseTicker}
                            />
                            <SSlideSelect
                                onClick={(index: any, _e: any) => {
                                    setCurrency(index);
                                }}
                                value={currency}
                            >
                                <SOption>{baseTicker}</SOption>
                                <SOption>{quoteTicker}</SOption>
                            </SSlideSelect>
                        </DetailsSection>
                    </PositionDetails>

                    <GraphContainer>
                        <LightWeightChart
                            historyData={lines as LineData}
                            liquidationPrice={liquidationPrice.toNumber()}
                            positionGraph
                        />
                    </GraphContainer>

                    <LegendsContainer>
                        Legend
                        <Legend>
                            <LegendTitle>
                                <LegendsIndicator colour={'var(--color-text)'} />
                                Last Price
                            </LegendTitle>
                            <LegendPrice>{toApproxCurrency(lines[lines.length - 1]?.value)}</LegendPrice>
                        </Legend>
                        <Legend>
                            <LegendTitle>
                                <LegendsIndicator colour="#F15025" />
                                Liquidation Price
                            </LegendTitle>
                            <LegendPrice>{toApproxCurrency(liquidationPrice)}</LegendPrice>
                        </Legend>
                    </LegendsContainer>
                </PositionInfo>

                <CloseOrderContainer id="position-close-container"> {/* Required for ReactTour */}
                    <CloseOrderButton />
                </CloseOrderContainer>

                {!account ? (
                    <ConnectOverlay />
                ) : balances.quote.eq(0) ? (
                    <PositionOverlay showMarketPreview={false} />
                ) : null}
            </div>
        );
    },
)`
    position: relative;
`;

export default PositionTab;

const PositionInfo = styled.div`
    width: 100%;
    display: flex;
`;

const PositionDetails = styled.div`
    width: 40%;

    &.exposure {
        border-top: 1px solid var(--color-accent);
        border-bottom: 1px solid var(--color-accent);
        padding-bottom: 0.25rem;
    }
`;

const GraphContainer = styled.div`
    width: 40%;
    border-bottom: 1px solid var(--color-accent);
`;

const LegendsContainer = styled.div`
    width: 20%;
    padding: 10px;
    color: var(--color-primary);
    font-size: var(--font-size-ultra-small);
    border-left: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
`;

const Legend = styled.div`
    margin-top: 10px;
`;

const LegendTitle = styled.div`
    display: flex;
    align-items: center;
`;

const LegendsIndicator = styled.div<{ colour: string }>`
    width: 24px;
    height: 7px;
    background-color: ${(props: any) => props.colour};
    border-radius: 10px;
    margin-right: 6px;
`;

const LegendPrice = styled.div`
    font-size: var(--font-size-small);
    color: var(--color-text);
`;

const DetailsRow = styled.div`
    display: flex;
`;

const CloseOrderContainer = styled.div`
    padding: 8px 0 8px 0.5rem;
`;

const DetailsSection = styled(Section)`
    display: block;
    position: relative;
    padding: 0.2rem 0 0.2rem 0.5rem;
    color: var(--color-secondary);
    border-bottom: 1px solid var(--color-accent);
    border-right: 1px solid var(--color-accent);

    &.b-r-none {
        border-right: none;
    }
    > .label {
        display: block;
        font-size: var(--font-size-extra-small);
    }
    > .content {
        padding-left: 0;
    }
`;

export const SPrevious = styled(Previous)`
    &:after {
        content: '>>';
    }
`;

const SSlideSelect = styled(SlideSelect)`
    color: var(--color-text);
    height: var(--height-extra-small-button);
    width: 8rem;
    margin: 0.2rem 0 0.2rem 0;
`;

const SOption = styled(Option)`
    font-size: var(--font-size-extra-small);
`;

export const Content = styled.div`
    font-size: var(--font-size-small);
    color: var(--color-text);
    text-align: left;
`;
