import React, { useContext } from 'react';
import { OrderContext } from 'context';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Box } from '@components/General';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import Error from '@components/General/Error';
import { Exposure, Leverage } from './Inputs';
import { OrderAction, orderDefaults, OrderState } from '@context/OrderContext';
import { AdjustSummary, MarketTradeDetails } from './PostTradeDetails';
import { BigNumber } from 'bignumber.js';
import { PositionSelect } from './Selects';

type SProps = {
    selected: number;
    setAdjustType: (index: number) => void;
    className?: string;
};

const AdjustTypeSelect: React.FC<SProps> = styled(
    ({ selected, className, setAdjustType }: SProps) => {
        return (
            <SlideSelect
                className={className}
                onClick={(index, _e) => {
                    setAdjustType(index);
                }}
                value={selected}
            >
                <Option>Adjust</Option>
                <Option>Close</Option>
            </SlideSelect>
        );
    },
)`
    border-radius: 0;
    border-bottom: 1px solid var(--color-accent);
    border-top: 0;
    border-right: 0;
    border-left: 0;
    height: 50px;

    > .bg-slider {
        background: var(--color-accent);
        border-radius: 0;
    }
`;

const SError = styled(Error)<{ account: string }>`
    position: relative;
    transform: translateY(-100%);
    display: ${(props) => (props.account === '' ? 'none' : 'block')};
    &.show {
        transform: translateY(0);
    }
`;

type CProps = {
    selectedTracer: Tracer | undefined;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    order: OrderState | undefined;
    className?: string;
};

const Close: React.FC<CProps> = ({ orderDispatch, selectedTracer, order }) => {
    return (
        <>
            <Exposure
                orderDispatch={orderDispatch}
                selectedTracer={selectedTracer}
                order={order ?? orderDefaults.order}
                closeInput={true}
            />

            <MarketTradeDetails
                fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                balances={selectedTracer?.getBalance() ?? defaults.balances}
                exposure={
                    order?.exposure
                        ? new BigNumber(order.exposure)
                        : defaults.exposure
                }
                nextPosition={order?.nextPosition ?? defaults.balances}
                slippage={order?.slippage ?? 0}
                tradePrice={
                    order?.marketTradePrice ??
                    orderDefaults.order.marketTradePrice
                }
                maxLeverage={
                    selectedTracer?.maxLeverage ?? defaults.maxLeverage
                }
            />
        </>
    );
};

type AProps = {
    selectedTracer: Tracer | undefined;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    order: OrderState | undefined;
    className?: string;
};

const Adjust: React.FC<AProps> = ({ order, orderDispatch, selectedTracer }) => {
    return (
        <>
            {/* Position select */}
            <div className="m-5">
                <PositionSelect selected={order?.position ?? 0} />
            </div>
            <Leverage
                min={new BigNumber(0)}
                max={selectedTracer?.getMaxLeverage()}
                leverage={order?.adjustLeverage ?? 0}
                adjustLeverage={true}
                orderDispatch={orderDispatch}
            />
            <AdjustSummary
                fairPrice={
                    selectedTracer?.getFairPrice() ?? defaults.oraclePrice
                }
                balances={selectedTracer?.getBalance() ?? defaults.balances}
                exposure={
                    order?.exposure
                        ? new BigNumber(order.exposure)
                        : defaults.exposure
                }
                nextPosition={order?.nextPosition ?? defaults.balances}
                baseTicker={selectedTracer?.baseTicker ?? ''}
                maxLeverage={
                    selectedTracer?.maxLeverage ?? defaults.maxLeverage
                }
            />
        </>
    );
};

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export default styled(({ selectedTracer, className, account }: TIProps) => {
    // switching to Close Position changes their position to the opposite side through OrderContext
    const { order, orderDispatch } = useContext(OrderContext);
    return (
        <>
            <Box className={`${className} ${account === '' ? 'hide' : ''} `}>
                {/* Position select */}
                <AdjustTypeSelect
                    selected={order?.adjustType ?? 0}
                    setAdjustType={(index) => {
                        orderDispatch
                            ? orderDispatch({
                                  type: 'setAdjustType',
                                  value: index,
                              })
                            : console.error('No dispatch function set');
                    }}
                />

                <div className="pt-3 pb-3">
                    {order?.adjustType !== 0 ? (
                        <Close
                            orderDispatch={orderDispatch}
                            selectedTracer={selectedTracer}
                            order={order}
                        />
                    ) : (
                        <Adjust
                            orderDispatch={orderDispatch}
                            order={order}
                            selectedTracer={selectedTracer}
                        />
                    )}
                </div>
                <AdvancedOrderButton>
                    {order?.adjustType === 0
                        ? 'Adjust Order'
                        : 'Close Position'}
                </AdvancedOrderButton>
            </Box>
            <SError
                error={order?.error ?? 'NO_ERROR'}
                account={account}
                context={'orders'}
            />
        </>
    );
})`
    transition: opacity 0.3s 0.1s, height: 0.3s 0.1s, padding 0.1s;
    overflow: auto;
    position: relative;
    border-bottom: none;
    background: #00125D;
    display: block;
    padding: 0;
    height: 100%;
    z-index: 1;
    &.hide {
        height: 0;
        padding: 0;
        opacity: 0;
        border: none;
    }
` as React.FC<TIProps>;
