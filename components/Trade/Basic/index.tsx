import React, { useContext, useEffect, useState } from 'react';
import { OrderContext, TracerContext } from 'context';
import LeverageSlider from '@components/Trade/LeverageSlider';
import TracerSelect from '@components/Trade/TracerSelect';
import { SlideSelect, PlaceOrderButton } from '@components/Buttons';
import { Card, Button } from '@components/General';
import { OrderAction, OrderState } from '@context/OrderContext';
import styled from 'styled-components'
import { calcLiquidationPrice, calcNotionalValue, toApproxCurrency } from '@libs/utils';
import { Section } from '@components/SummaryInfo';
import { UserBalance } from 'types';

type PProps = {
    dispatch: React.Dispatch<OrderAction> | undefined;
    position: number;
    className?: string;
};

const Position: React.FC<PProps> = styled(({ className, dispatch, position }: PProps) => {
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
                <a className="m-auto">SHORT</a>
                <a className="m-auto">LONG</a>
            </SlideSelect>
        </div>
    );
})`
    width: 300px;
    margin-left: auto;
`

const Title = styled.h1`
    font-size: 20px;
    letter-spacing: -0.4px;
    color: #FFFFFF;
    font-weight: normal;
    padding: 0;
`


const SSection = styled(Section)`
    border-bottom: 1px solid #011772;
    letter-spacing: -0.32px;
    font-size: 16px;
    padding: 5px 10px;
    margin: 0;
`

const LiquidationPrice = styled(Section)`
    background: #F15025;
    background-size: 100%;
    border-bottom: 1px solid #011772;
    letter-spacing: -0.32px;
    font-size: 16px;
    padding: 5px 0;
    margin: 0;
    .label {
        color: #fff;
        padding: 0 10px;
    }
    .content {
        padding-right: 10px;
    }
`

const PrevBalance = styled.span`
    color: #005EA4;
    margin-right: 5px;
`
interface SProps {
    balances: UserBalance;
    fairPrice: number;
    order: OrderState | undefined;
    exposure: number;
    maxLeverage: number;
    className?: string;
}
const Summary: React.FC<SProps> = styled(({ 
    balances, fairPrice, order, maxLeverage, exposure, className
}: SProps) => {
    const position = order?.position ?? 0;
    const newQuote =
        position === 0
            ? balances.quote - (exposure ?? 0) // short
            : balances.quote + (exposure ?? 0); // long
    const newBase =
        position === 0
            ? balances.base + calcNotionalValue(exposure ?? 0, fairPrice) // short
            : balances.base - calcNotionalValue(exposure ?? 0, fairPrice); // long
    return (
        <div className={className}>
            <h3>Order Summary</h3>
            <SSection label={'Order Type'}>
                Market
            </SSection>
            <SSection label={'Market Price'}>
                {`${toApproxCurrency(order?.price ?? 0)} ${order?.collateral ?? ''}`}
            </SSection>
            <LiquidationPrice label={'Liquidation Price'}>
                {`${toApproxCurrency(calcLiquidationPrice(newBase, newQuote, fairPrice, maxLeverage ?? 1))} ${order?.collateral ?? ''}`}
            </LiquidationPrice>
            <SSection label={'Slippage % Fees'}>
                {`${toApproxCurrency(order?.price ?? 0)} ${order?.collateral ?? ''}`}
            </SSection>
            <SSection label={'Wallet Balance'}>
                <PrevBalance>
                    {`${toApproxCurrency(balances?.tokenBalance)} ${order?.collateral ?? ''} >>> `}
                </PrevBalance>
                {`${toApproxCurrency(order?.price ?? 0)} ${order?.collateral ?? ''}`}
            </SSection>
            <SSection label={'Predicted Const Total'}>
                {`${toApproxCurrency(order?.price ?? 0)} ${order?.collateral ?? ''}`}
            </SSection>
        </div>
    );
})`
    height: 0; 
    margin: 0;
    overflow: hidden;
    transition: height 0.5s ease-in-out, opacity 0.5s ease-in 0.2s;
    opacity: 0;
    background: #002886;
    border-radius: 10px;
    h3 {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #ffffff;
        padding: 10px;
    }
    .show & {
        height: 260px;
        opacity: 1;
    }
`

const SCard = styled(Card)`
    width: 596px;
    height: 60vh;
    display: flex;
    flex-direction: column;
    transition: 0.5s ease-in-out;
    padding: 20px;
    margin: 0 auto;
    &.show {
        height: 85vh;
    }
`

const Basic: React.FC = () => {
    const { selectedTracer } = useContext(TracerContext);
    const { order, exposure, orderDispatch } = useContext(OrderContext);
    const [showSummary, setShowSummary] = useState(false);
    const balances = selectedTracer?.balances;

    useEffect(() => {
        if (order?.position) {
            setShowSummary(true);
        } else {
            setShowSummary(false)
        }
    }, [order?.position])
    return (
        <div className="container mx-auto mt-3 h-full flex">
            <SCard className={`${showSummary ? 'show' : ''}`}>
                <div className="flex">
                    <Title>Basic Trade</Title>
                    <Position
                        dispatch={orderDispatch}
                        position = {order?.position ?? 0}
                    />
                </div>
                <TracerSelect />
                <LeverageSlider leverage={order?.leverage ?? 1} />
                <Summary 
                    balances={balances ?? {
                        base: 0, 
                        quote: 0, 
                        tokenBalance: 0,
                        totalLeveragedValue: 0,
                        lastUpdatedGasPrice:0
                    } as UserBalance} 
                    order={order}
                    maxLeverage={selectedTracer?.maxLeverage ?? 1}
                    fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)}
                    exposure={exposure ?? 0}
                />
                <PlaceOrderButton className="mt-auto" balance={balances?.base ?? 0}>
                    <Button className="mx-auto">Place Trade</Button>
                </PlaceOrderButton>
            </SCard>
        </div>
    );
};

export default Basic;

// Collateral -> Required deposit
// For basic required collateral is fixed based on amount and leverage

// Leveral slider should not move automatically
// changing leverage slider will change the required deposit

// Market -> Amount
// Current market value displayed under market
