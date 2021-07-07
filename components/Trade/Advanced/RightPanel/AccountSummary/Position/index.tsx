import React, { FC, useContext, useState } from 'react';
import { Web3Context } from '@context/Web3Context';
import { LIMIT, OrderContext, orderDefaults, OrderState } from '@context/OrderContext';
import { BigNumber } from 'bignumber.js';
import { getPositionText, toApproxCurrency } from '@libs/utils';
import { calcLeverage, calcUnrealised } from '@tracer-protocol/tracer-utils';
import { CloseOrderButton } from '@components/Buttons/OrderButton';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import PositionOverlay from '@components/Overlay/PositionOverlay';
import { UserBalance } from '@libs/types/TracerTypes';
import { FilledOrder } from '@libs/types/OrderTypes';
import styled from 'styled-components';
import { Previous, Section } from '@components/General';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';

interface PTProps {
    balances: UserBalance;
    fairPrice: BigNumber;
    baseTicker: string;
    quoteTicker: string;
    filledOrders: FilledOrder[];
}
const PositionTab: FC<PTProps> = ({ balances, fairPrice, baseTicker, quoteTicker, filledOrders }: PTProps) => {
    const [currency, setCurrency] = useState(0); // 0 quoted in base
    const { account } = useContext(Web3Context);
    const { order } = useContext(OrderContext);
    const { base } = balances;
    return (
        <PositionContent>
            <PositionDetails>
                <DetailsRow>
                    <DetailsSection label="Side" className="w-1/2">
                        <Position
                            balances={balances}
                            nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
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
                            <Content>{toApproxCurrency(calcUnrealised(base, fairPrice, filledOrders), 3)}</Content>
                        ) : (
                            `-`
                        )}
                    </DetailsSection>
                </DetailsRow>

                <DetailsRow>
                    <DetailsSection label="Leverage" className="w-1/2">
                        <Leverage
                            balances={balances}
                            nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
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
                        onClick={(index, _e) => {
                            setCurrency(index);
                        }}
                        value={currency}
                    >
                        <SOption>{baseTicker}</SOption>
                        <SOption>{quoteTicker}</SOption>
                    </SSlideSelect>
                </DetailsSection>
                <CloseOrderContainer>
                    <CloseOrderButton />
                </CloseOrderContainer>
            </PositionDetails>
            {account === '' ? <ConnectOverlay /> : balances.quote.eq(0) ? <PositionOverlay /> : null}
        </PositionContent>
    );
};

const DetailsRow = styled.div`
    display: flex;
`;

const PositionContent = styled.div`
    width: 100%;
    display: flex;
    position: relative;
`;

const PositionDetails = styled.div`
    width: 40%;

    &.exposure {
        border-top: 1px solid var(--color-accent);
        border-bottom: 1px solid var(--color-accent);
        padding-bottom: 0.25rem;
    }
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

const Position: React.FC<ContentProps> = ({ nextPosition, exposure, tradePrice, balances }) => {
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>{getPositionText(balances.base)}</SPrevious>
                {getPositionText(nextPosition.base)}
            </Content>
        );
    } // else
    return <Content>{getPositionText(balances.base)}</Content>;
};

const Leverage: React.FC<ContentProps & { orderType: number; fairPrice: BigNumber }> = ({
    nextPosition,
    exposure,
    tradePrice,
    orderType,
    fairPrice,
    balances,
}) => {
    const l = calcLeverage(balances.quote, balances.base, fairPrice);
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>{`${l.toFixed(2)}x`}</SPrevious>
                {`${calcLeverage(
                    nextPosition.quote,
                    nextPosition.base,
                    orderType === LIMIT ? new BigNumber(tradePrice) : fairPrice,
                ).toFixed(2)}x`}
            </Content>
        );
    } // else
    return <Content>{`${l.toPrecision(3)}x`}</Content>;
};

const Exposure: React.FC<{
    baseTicker: string;
    quoteTicker: string;
    order: OrderState;
    balances: UserBalance;
    fairPrice: BigNumber;
    currency: number;
}> = ({ order, baseTicker, quoteTicker, fairPrice, balances, currency }) => {
    const { nextPosition, exposure, orderType, price } = order;
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && price) {
        return (
            <Content className="pt-1">
                <SPrevious>
                    {currency === 0
                        ? `${parseFloat(balances.base.abs().toFixed(2))} ${baseTicker}`
                        : `${toApproxCurrency(
                              balances.base.abs().times(orderType === LIMIT ? price : fairPrice),
                          )} ${quoteTicker}`}
                </SPrevious>
                {currency === 0
                    ? `${parseFloat(nextPosition.base.abs().toFixed(2))} ${baseTicker}`
                    : `${toApproxCurrency(
                          nextPosition.base.abs().times(orderType === LIMIT ? price : fairPrice),
                      )} ${quoteTicker}`}
            </Content>
        );
    } // else
    return (
        <Content className="pt-1">
            {currency === 0
                ? `${parseFloat(balances.base.abs().toFixed(2))} ${baseTicker}`
                : `${toApproxCurrency(parseFloat(balances.base.abs().times(fairPrice).toFixed(2)))} ${quoteTicker}`}
        </Content>
    );
};

const SPrevious = styled(Previous)`
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

const Content = styled.div`
    font-size: var(--font-size-small);
    color: var(--color-text);
    text-align: left;
`;

type ContentProps = {
    exposure: number;
    tradePrice: number;
    nextPosition: {
        base: BigNumber;
        quote: BigNumber;
    };
    balances: UserBalance;
};

export default PositionTab;
