import React, { useContext } from 'react';
import { OrderContext } from 'context';
import { LIMIT, MARKET, orderDefaults } from '@context/OrderContext';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Box } from '@components/General';
import { AdvancedOrderButton } from '@components/OrderButtons';
import Error from '@components/General/Error';
import { Exposure, LeverageInput, Price } from './Inputs';
import { MarketTradeDetails, LimitTradeDetails } from './PostTradeDetails';
import { OrderTypeSelect, PositionSelect } from './Selects';
import DoubleSidedSlider from './DoubleSidedSlider';
import Divider from '@components/General/Divider';

const Section = styled.div`
    margin: 12px 0;
`;

const SError = styled(Error)<{ account: string }>`
    position: relative;
    transform: translateY(-100%);
    display: ${(props) => (props.account === '' ? 'none' : 'block')};
    &.show {
        transform: translateY(0);
    }
`;

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export default (({ selectedTracer, account }: TIProps) => {
    const { order, orderDispatch } = useContext(OrderContext);
    return (
        <>
            <StyledBox>
                {/* Order type select */}
                <OrderTypeSelect selected={order?.orderType ?? 0} />

                {order?.orderType === MARKET ? (
                    <Divider text={'New Order'} tooltip={{ key: 'new-order', props: { baseTicker: order?.market } }} />
                ) : null}
                {/* Position select */}
                <Section>
                    <PositionSelect selected={order?.position ?? 0} />
                </Section>

                {/* Quantity and Price Inputs */}
                <Section>
                    <Exposure
                        orderDispatch={orderDispatch}
                        className="px-8"
                        selectedTracer={selectedTracer}
                        order={order ?? orderDefaults.order}
                    />
                </Section>
                {/* <Details>
                    {order?.leverage !== 1 && exposure && price ? (
                        <span>{`Leveraged at ${order?.leverage}x`}</span>
                    ) : null}
                    {exposure && price ? <Approx>{toApproxCurrency(exposure * price * leverage)}</Approx> : null}
                </Details> */}

                {/*Dont display price select if it is a market order*/}
                {order?.orderType === LIMIT ? (
                    <>
                        {/* LIMIT ORDER */}
                        <Price
                            className="px-8"
                            orderDispatch={orderDispatch}
                            selectedTracer={selectedTracer}
                            price={order?.price ?? defaults.price}
                        />
                        <LimitTradeDetails
                            fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                            balances={selectedTracer?.getBalance() ?? defaults.balances}
                            exposure={order?.exposureBN ?? defaults.exposure}
                            nextPosition={order?.nextPosition ?? defaults.balances}
                            orderPrice={order?.price ?? 0}
                            maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        />
                    </>
                ) : (
                    <>
                        {/* MARKET ORDER */}
                        <Divider
                            text={'Adjust Position'}
                            tooltip={{ key: 'adjust-position', props: { baseTicker: order?.market } }}
                        />
                        <LeverageInput
                            className="px-8"
                            orderDispatch={orderDispatch}
                            selectedTracer={selectedTracer}
                            leverage={order?.leverage ?? 0}
                        />
                        <DoubleSidedSlider
                            className="px-8"
                            min={selectedTracer?.getMaxLeverage().negated().toNumber()}
                            max={selectedTracer?.getMaxLeverage().toNumber()}
                            value={order?.leverage ?? 0}
                            orderDispatch={orderDispatch}
                        />
                        <MarketTradeDetails
                            fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                            balances={selectedTracer?.getBalance() ?? defaults.balances}
                            order={order ?? orderDefaults.order}
                            maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        />
                    </>
                )}

                {/* Place Order */}
                {order?.error === 'NO_ERROR' ? (
                    <div className={`m-2`}>
                        <AdvancedOrderButton>Place Order</AdvancedOrderButton>
                    </div>
                ) : null}
            </StyledBox>
            <SError error={order?.error ?? 'NO_ERROR'} account={account} context={'orders'} />
        </>
    );
}) as React.FC<TIProps>;

const StyledBox = styled(Box)`
    transition: opacity 0.3s 0.1s, height: 0.3s 0.1s, padding 0.1s;
    position: relative;
    border-bottom: none;
    overflow: auto;
    display: block;
    padding: 0;
    z-index: 1;
`;
