import React, { useContext, useEffect, useState } from 'react';
import { OrderContext, TracerContext } from 'context';
import BasicInterface2 from '@components/Trade/Basic/BasicInterface2';
import { SlideSelect, PlaceOrderButton } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Card, Button, Previous, HiddenExpand } from '@components/General';
import { OrderAction, OrderState } from '@context/OrderContext';
import styled from 'styled-components';
import {
    calcLiquidationPrice,
    calcNotionalValue,
} from '@tracer-protocol/tracer-utils';
import { toApproxCurrency } from '@libs/utils';
import { Section } from '@components/General';
import { UserBalance } from 'types';
import Error from '@components/General/Error';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import DefaultSlider from '@components/General/Slider';
import { orderDefaults } from '@context/OrderContext';

type PProps = {
    dispatch: React.Dispatch<OrderAction> | undefined;
    position: number;
    className?: string;
};

const Position: React.FC<PProps> = styled(
    ({ className, dispatch, position }: PProps) => {
        return (
            <div className={className}>
                <SlideSelect
                    onClick={(index, _e) =>
                        dispatch
                            ? dispatch({ type: 'setPosition', value: index })
                            : console.error('Order dispatch function not set')
                    }
                    value={position}
                >
                    <Option className="my-2">SHORT</Option>
                    <Option className="my-2">LONG</Option>
                </SlideSelect>
            </div>
        );
    },
)`
    width: 300px;
    margin-left: auto;
`;

const SSection = styled(Section)`
    border-bottom: 1px solid #011772;
    letter-spacing: -0.32px;
    font-size: var(--font-size-small);
    padding: 5px 10px;
    margin: 0;
`;

const LiquidationPrice = styled(Section)`
    background: #f15025;
    background-size: 100%;
    border-bottom: 1px solid #011772;
    letter-spacing: -0.32px;
    font-size: var(--font-size-small);
    padding: 5px 0;
    margin: 0;

    .label {
        color: var(--color-text);
        padding: 0 10px;
    }
    .content {
        padding-right: 10px;
    }
`;

interface SProps {
    balances: UserBalance;
    fairPrice: BigNumber;
    order: OrderState | undefined;
    maxLeverage: BigNumber;
    className?: string;
}

const OrderSummary: React.FC<SProps> = styled(
    ({ balances, fairPrice, order, maxLeverage, className }: SProps) => {
        const { exposure } = order ?? orderDefaults.order;
        const position = order?.position ?? 0;
        const notional: BigNumber = calcNotionalValue(
            new BigNumber(exposure),
            fairPrice,
        );
        const newBase =
            position === 0
                ? balances.base.minus(exposure) // short
                : balances.base.plus(exposure); // long
        const newQuote: BigNumber =
            position === 0
                ? balances.quote.plus(notional) // short
                : balances.quote.minus(notional); // long
        return (
            <HiddenExpand
                className={className}
                defaultHeight={0}
                open={!!order?.amountToPay || !!order?.exposure}
            >
                <h3>Order Summary</h3>
                <SSection label={'Order Type'}>Market</SSection>
                <SSection label={'Market Price'}>
                    {`${toApproxCurrency(order?.price ?? 0)} ${
                        order?.collateral ?? ''
                    }`}
                </SSection>
                <LiquidationPrice label={'Liquidation Price'}>
                    {`${toApproxCurrency(
                        calcLiquidationPrice(
                            newQuote,
                            newBase,
                            fairPrice,
                            maxLeverage,
                        ),
                    )} ${order?.collateral ?? ''}`}
                </LiquidationPrice>
                <SSection label={'Slippage % Fees'}>
                    {`${toApproxCurrency(order?.price ?? 0)} ${
                        order?.collateral ?? ''
                    }`}
                </SSection>
                <SSection label={'Wallet Balance'}>
                    <Previous>{`${toApproxCurrency(
                        order?.wallet ? balances.tokenBalance : balances.quote,
                    )}`}</Previous>
                    {`${toApproxCurrency(order?.price ?? 0)} ${
                        order?.collateral ?? ''
                    }`}
                </SSection>
                <SSection label={'Predicted Const Total'}>
                    {`${toApproxCurrency(order?.price ?? 0)} ${
                        order?.collateral ?? ''
                    }`}
                </SSection>
            </HiddenExpand>
        );
    },
)`
    overflow: scroll;
    background: var(--color-accent);
    margin: 10px 0;
    > .body {
        padding: 0;
    }
    h3 {
        font-size: var(--font-size-small);
        letter-spacing: -0.32px;
        color: #ffffff;
        padding: 10px;
    }
`;

const Title = styled.h1`
    font-size: var(--font-size-medium);
    letter-spacing: -0.4px;
    color: #ffffff;
    font-weight: normal;
    padding: 0;
`;

const SCard = styled(Card)`
    position: relative;
    width: 596px;
    height: 650px;
    display: flex;
    flex-direction: column;
    transition: 0.5s ease-in-out;
    padding: 20px;
    margin: 0 auto;
    &.show {
        height: 780px;
    }
`;

const SButton = styled(Button)`
    border: 1px solid #ffffff;
    color: var(--color-text);

    .button-disabled &:hover {
        cursor: not-allowed;
    }
    #tooltip {
        display: none;
    }
    .button-disabled #tooltip {
        display: block;
    }
`;

const Header = styled.div`
    display: flex;
    border-bottom: 1px solid var(--color-accent);
    padding-bottom: 0.5rem;
    letter-spacing: -0.32px;
`;

const Basic: React.FC = styled(({ className }) => {
    const { selectedTracer, balances: _balances } = useContext(TracerContext);
    const { order, orderDispatch } = useContext(OrderContext);
    const [showSummary, setShowSummary] = useState(false);
    const balances = _balances ?? defaults.balances;
    const fairPrice = selectedTracer?.oraclePrice ?? defaults.oraclePrice;

    useEffect(() => {
        // could have equally been checking on the margin variable
        if (order?.exposure || order?.amountToPay) {
            setShowSummary(true);
        } else {
            setShowSummary(false);
        }
    }, [order]);

    useEffect(() => {
        if (orderDispatch) {
            orderDispatch({ type: 'setAdvanced', value: true });
        } else {
            console.error('Order dispatch undefined');
        }
    }, []);

    return (
        <div className={`container mx-auto mt-3 ${className}`}>
            <SCard className={`${showSummary ? 'show' : ''}`}>
                <Header>
                    <Title>Market Trade</Title>
                    <Position
                        dispatch={orderDispatch}
                        position={order?.position ?? 0}
                    />
                </Header>

                {/** Display the variant basic interfaces, workout ab testing for this */}
                <BasicInterface2 />

                <DefaultSlider
                    value={order?.leverage ?? 1}
                    handleChange={(num) => {
                        orderDispatch
                            ? orderDispatch({ type: 'setLeverage', value: num })
                            : console.error('Order dispatch not set');
                    }}
                />

                <OrderSummary
                    balances={balances}
                    order={order}
                    maxLeverage={
                        selectedTracer?.maxLeverage ?? defaults.maxLeverage
                    }
                    fairPrice={fairPrice}
                />
                <PlaceOrderButton className="mt-auto mb-2">
                    <SButton className="mx-auto">Place Trade</SButton>
                </PlaceOrderButton>
                <Error error={order?.error ?? 'NO_ERROR'} context="orders" />
            </SCard>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-bottom: 60px;
`;

export default Basic;

// Collateral -> Required deposit
// For basic required collateral is fixed based on amount and leverage

// Leveral slider should not move automatically
// changing leverage slider will change the required deposit

// Market -> Amount
// Current market value displayed under market
