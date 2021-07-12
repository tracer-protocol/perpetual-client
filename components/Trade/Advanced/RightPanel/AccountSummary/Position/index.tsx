import React, { FC, useContext, useState } from 'react';
import { Web3Context } from '@context/Web3Context';
import { OrderContext, orderDefaults } from '@context/OrderContext';
import { BigNumber } from 'bignumber.js';
import { toApproxCurrency } from '@libs/utils';
import { calcUnrealised } from '@tracer-protocol/tracer-utils';
import { CloseOrderButton } from '@components/OrderButtons';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import PositionOverlay from '@components/Overlay/PositionOverlay';
import { HistoryData, UserBalance } from '@libs/types/TracerTypes';
import { FilledOrder } from '@libs/types/OrderTypes';
import styled from 'styled-components';
import { Previous, Section } from '@components/General';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import Side from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Side';
import Leverage from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Leverage';
import Exposure from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Exposure';
import LightWeightChart from '@components/Charts/LightWeightLineChart';

const history = [
    { time: '2021-06-11', value: 80.01 },
    { time: '2021-06-12', value: 96.63 },
    { time: '2021-06-13', value: 106.64 },
    { time: '2021-06-14', value: 121.89 },
    { time: '2021-06-15', value: 114.43 },
    { time: '2021-06-16', value: 104.01 },
    { time: '2021-06-17', value: 96.63 },
    { time: '2021-06-18', value: 76.64 },
    { time: '2021-06-19', value: 81.89 },
    { time: '2021-06-20', value: 104.43 },
    { time: '2021-06-21', value: 94.01 },
    { time: '2021-06-22', value: 106.63 },
    { time: '2021-06-23', value: 116.64 },
    { time: '2021-06-24', value: 121.89 },
    { time: '2021-06-25', value: 124.43 },
    { time: '2021-06-26', value: 130.01 },
    { time: '2021-06-27', value: 136.63 },
    { time: '2021-06-28', value: 146.64 },
    { time: '2021-06-29', value: 141.89 },
    { time: '2021-06-30', value: 154.43 },
];

interface PTProps {
    className?: string;
    balances: UserBalance;
    fairPrice: BigNumber;
    baseTicker: string;
    quoteTicker: string;
    filledOrders: FilledOrder[];
}

const PositionTab: FC<PTProps> = styled(
    ({ className, balances, fairPrice, baseTicker, quoteTicker, filledOrders }: PTProps) => {
        const [currency, setCurrency] = useState(0); // 0 quoted in base
        const { account } = useContext(Web3Context);
        const { order } = useContext(OrderContext);
        const { base } = balances;

        return (
            <div className={className}>
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
                                tooltip={{ key: `unrealised-pnl`, props: { baseTicker: baseTicker } }}
                            >
                                {!balances.quote.eq(0) ? (
                                    <Content>
                                        {toApproxCurrency(calcUnrealised(base, fairPrice, filledOrders), 3)}
                                    </Content>
                                ) : (
                                    `-`
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
                                tooltip={{ key: `realised-pnl`, props: { baseTicker: baseTicker } }}
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
                        <LightWeightChart historyData={history as HistoryData} positionGraph />
                    </GraphContainer>

                    <LegendsContainer>
                        Legend
                        <Legend>
                            <LegendTitle>
                                <LegendsIndicator colour={`var(--color-text)`} />
                                Last Price
                            </LegendTitle>
                            <LegendPrice>{toApproxCurrency(120.45)}</LegendPrice>
                        </Legend>
                        <Legend>
                            <LegendTitle>
                                <LegendsIndicator colour="#F15025" />
                                Liquidation Price
                            </LegendTitle>
                            <LegendPrice>{toApproxCurrency(50)}</LegendPrice>
                        </Legend>
                    </LegendsContainer>
                </PositionInfo>

                <CloseOrderContainer>
                    <CloseOrderButton />
                </CloseOrderContainer>

                {account === '' ? <ConnectOverlay /> : balances.quote.eq(0) ? <PositionOverlay /> : null}
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
    padding: 1rem 0 1rem 0.5rem;
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
    margin: 0.5rem 0 0.5rem 0;
`;

const SOption = styled(Option)`
    font-size: var(--font-size-extra-small);
`;

export const Content = styled.div`
    font-size: var(--font-size-small);
    color: var(--color-text);
    text-align: left;
`;
