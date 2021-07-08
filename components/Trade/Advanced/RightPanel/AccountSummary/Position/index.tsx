import React, { FC, useContext, useState } from 'react';
import { Web3Context } from '@context/Web3Context';
import { OrderContext, orderDefaults } from '@context/OrderContext';
import { BigNumber } from 'bignumber.js';
import { toApproxCurrency } from '@libs/utils';
import { calcUnrealised } from '@tracer-protocol/tracer-utils';
import { CloseOrderButton } from '@components/Buttons/OrderButton';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import PositionOverlay from '@components/Overlay/PositionOverlay';
import { UserBalance } from '@libs/types/TracerTypes';
import { FilledOrder } from '@libs/types/OrderTypes';
import styled from 'styled-components';
import { Previous, Section } from '@components/General';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import Side from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Side';
import Leverage from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Leverage';
import Exposure from '@components/Trade/Advanced/RightPanel/AccountSummary/Position/Exposure';

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
                        <Side
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

export default PositionTab;

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
