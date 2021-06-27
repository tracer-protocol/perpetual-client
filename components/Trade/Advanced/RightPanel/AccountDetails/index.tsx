import React, { useState, useContext } from 'react';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Table, TRow, TData } from '@components/General/Table';
import { calcStatus, timeAgo, toApproxCurrency, getPositionText } from '@libs/utils';
import Web3 from 'web3';
import { calcLiquidationPrice, calcUnrealised, OMEOrder } from '@tracer-protocol/tracer-utils';
import { FilledOrder } from 'types/OrderTypes';
import { calcLeverage } from '@tracer-protocol/tracer-utils';
import { Button, Previous, Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import { TransactionContext } from '@context/TransactionContext';
import { cancelOrder } from '@libs/Ome';
import { OMEContext } from '@context/OMEContext';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import CustomSubNav from './CustomSubNav';
import { OrderContext } from '@context/OrderContext';

const AccountDetails = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;
const SPrevious = styled(Previous)`
    &:after {
        content: '>>';
    }
`;

const AccountDetailsSection = styled(Section)`
    display: inline-block;
    position: relative;
    padding: 5px 10px;
    margin: 0;
    color: #005ea4;
    min-height: var(--height-small-container);
    border-bottom: 1px solid var(--color-accent);

    &.border-right {
        border-right: 1px solid var(--color-accent);
    }

    > .label {
        display: block;
        font-size: var(--font-size-extra-small);
    }
    > .content {
        padding-left: 0;
    }
`;

const SectionContainer = styled.div`
    border-right: 1px solid var(--color-accent);
    width: 100%;
    display: block;

    &.exposure {
        border-top: 1px solid var(--color-accent);
        border-bottom: 1px solid var(--color-accent);
        padding-bottom: 0.25rem;
    }
`;

const SSlideSelect = styled(SlideSelect)`
    position: absolute;
    right: 6px;
    top: 6px;
    height: var(--height-extra-small-button);
    width: 100px;
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

const Leverage: React.FC<ContentProps & { fairPrice: BigNumber }> = ({
    nextPosition,
    exposure,
    tradePrice,
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
                {`${calcLeverage(nextPosition.quote, nextPosition.base, new BigNumber(tradePrice)).toFixed(2)}x`}
            </Content>
        );
    } // else
    return <Content>{`${l.toPrecision(3)}x`}</Content>;
};

interface IProps {
    balances: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    baseTicker: string;
    quoteTicker: string;
    filledOrders: FilledOrder[];
}

const PositionDetails: React.FC<IProps> = ({
    balances,
    fairPrice,
    baseTicker,
    quoteTicker,
    maxLeverage,
    filledOrders,
}: IProps) => {
    const { order } = useContext(OrderContext);
    const [currency, setCurrency] = useState(0); // 0 quoted in base
    const { base } = balances;
    return (
        <AccountDetails>
            <SectionContainer className="w-2/6 inline-block">
                <AccountDetailsSection label={'Side'}>
                    <Position
                        balances={balances}
                        nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
                        tradePrice={order?.price ?? 0}
                        exposure={order?.exposure ?? 0}
                    />
                </AccountDetailsSection>
                <AccountDetailsSection
                    label={'Exposure'}
                    className="w-full"
                    tooltip={{ key: 'exposure', props: { baseTicker: baseTicker } }}
                >
                    {!balances.quote.eq(0) ? (
                        <Content className="pt-1">
                            {currency === 0
                                ? `${parseFloat(base.abs().toFixed(3))} ${baseTicker}`
                                : `${toApproxCurrency(
                                      parseFloat(base.abs().times(fairPrice).toFixed(3)),
                                  )} ${quoteTicker}`}
                            <SSlideSelect
                                onClick={(index, _e) => {
                                    setCurrency(index);
                                }}
                                value={currency}
                            >
                                <SOption>{baseTicker}</SOption>
                                <SOption>{quoteTicker}</SOption>
                            </SSlideSelect>
                        </Content>
                    ) : (
                        `-`
                    )}
                </AccountDetailsSection>
                <AccountDetailsSection label={'Leverage'}>
                    <Leverage
                        balances={balances}
                        nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
                        tradePrice={order?.price ?? 0}
                        fairPrice={fairPrice}
                        exposure={order?.exposure ?? 0}
                    />
                </AccountDetailsSection>
            </SectionContainer>
            <SectionContainer className="w-4/6 inline-block">
                <AccountDetailsSection
                    label={'Liquidation Price'}
                    className="w-1/2 border-right"
                    tooltip={{ key: 'liquidation-price', props: { quote: balances.quote, position: order?.position } }}
                >
                    {!balances.quote.eq(0) ? (
                        <Content>
                            {toApproxCurrency(
                                parseFloat(
                                    calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(
                                        3,
                                    ),
                                ),
                            )}
                        </Content>
                    ) : (
                        `-`
                    )}
                </AccountDetailsSection>
                <AccountDetailsSection
                    label={'Unrealised PnL'}
                    className="w-1/2"
                    tooltip={{ key: `unrealised-pnl`, props: { baseTicker: baseTicker } }}
                >
                    {!balances.quote.eq(0) ? (
                        <Content>{toApproxCurrency(calcUnrealised(base, fairPrice, filledOrders), 3)}</Content>
                    ) : (
                        `-`
                    )}
                </AccountDetailsSection>
                <AccountDetailsSection label={'Mark Price'} className="w-1/2 border-right">
                    {!balances.quote.eq(0) ? <Content>{toApproxCurrency(fairPrice)}</Content> : `-`}
                </AccountDetailsSection>
                {/* <AccountDetailsSection
                    label={'Realised PnL'}
                    className="w-1/2"
                    tooltip={{ key: `realised-pnl`, props: { baseTicker: baseTicker } }}
                >
                    {!balances.quote.eq(0) ? <Content>{toApproxCurrency(0)}</Content> : `-`}
                </AccountDetailsSection> */}
            </SectionContainer>
        </AccountDetails>
    );
};

const STable = styled(Table)`
    > tbody {
        display: block;
        max-height: 15vh;
        overflow-y: scroll;
    }
    > thead {
        display: table;
        table-layout: fixed; /* even columns width , fix width of table too*/
        width: calc(100% - 5px) !important; /* scrollbar is 5px */
    }
    > tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed; /* even columns width , fix width of table too*/
        overflow: auto;
    }
`;

const Cancel = styled(Button)`
    height: 28px;
    opacity: 0.8;
    width: auto;
    padding: 0 5px;
    max-width: 80px;
    margin: auto;
    line-height: 25px;

    &:hover {
        opacity: 1;
    }
`;

const OpenOrders: React.FC<{
    userOrders: OMEOrder[];
    baseTicker: string;
    refetch: () => void;
}> = React.memo(({ userOrders, baseTicker, refetch }) => {
    const { handleAsync } = useContext(TransactionContext);
    const _cancelOrder = (market: string, orderId: string) => {
        console.info(`Attempting to cancel order: ${orderId} on market: ${market}`);
        handleAsync
            ? handleAsync(cancelOrder, [market, orderId], {
                  statusMessages: {
                      waiting: `Cancelling order: ${orderId} on market ${market} `,
                  },
                  callback: () => refetch(),
              })
            : console.error('Failed to cancel order: Handle transaction not defined');
    };
    return (
        <STable headings={['Status', 'Side', 'Price', 'Amount', 'Filled', 'Remaining', '']}>
            <tbody>
                {userOrders?.map((order, index) => {
                    const amount = parseFloat(Web3.utils.fromWei(order?.amount?.toString() ?? '0')),
                        amountLeft = parseFloat(Web3.utils.fromWei(order?.amount_left?.toString() ?? '0')),
                        filled = amount - amountLeft;
                    return (
                        <TRow key={`open-order-${index}`}>
                            <TData>{calcStatus(filled)}</TData>
                            <TData className={order.side.toLowerCase() /** This will be the global .bid or .ask */}>
                                {order.side === 'Bid' ? 'Long' : 'Short'}
                            </TData>
                            <TData>{toApproxCurrency(parseFloat(Web3.utils.fromWei(order.price.toString())))}</TData>
                            <TData>
                                {parseFloat(amount.toFixed(3))} {baseTicker}
                            </TData>
                            <TData>
                                {filled} {baseTicker}
                            </TData>
                            <TData>
                                {parseFloat(amountLeft.toFixed(3))} {baseTicker}
                            </TData>
                            <TData>
                                <Cancel onClick={(_e) => _cancelOrder(order.target_tracer, order.id)}>Cancel</Cancel>
                            </TData>
                        </TRow>
                    );
                })}
            </tbody>
        </STable>
    );
});
OpenOrders.displayName = 'OpenOrders';

const Fills: React.FC<{
    filledOrders: FilledOrder[];
}> = React.memo(({ filledOrders }) => {
    return (
        <STable headings={['Time', 'Side', 'Price', 'Amount']}>
            <tbody>
                {filledOrders.map((order, index) => {
                    return (
                        <TRow key={`filled-order-${index}`}>
                            <TData>{timeAgo(Date.now(), parseInt(order.timestamp) * 1000)}</TData>
                            <TData className={!!order.position ? 'ask' : 'bid'}>
                                {!!order.position ? 'Short' : 'Long'}
                            </TData>
                            <TData>{toApproxCurrency(order.price)}</TData>
                            <TData>{parseFloat(order.amount.toFixed(3))}</TData>
                            {/*TODO: Fee value*/}
                            {/*<TData>{toApproxCurrency(order.amount.times(price))}/$0</TData>*/}
                        </TRow>
                    );
                })}
            </tbody>
        </STable>
    );
});

Fills.displayName = 'Fills';

type TSProps = {
    selectedTracer: Tracer | undefined;
    className?: string;
};

export default styled(({ selectedTracer, className }: TSProps) => {
    const [tab, setTab] = useState(0);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const fairPrice = selectedTracer?.getFairPrice() ?? defaults.fairPrice;
    const {
        omeState,
        omeDispatch = () => {
            console.error('OME dispatch is undefined');
        },
        // @ts-ignore
        filledOrders,
    } = useContext(OMEContext);

    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <PositionDetails
                        balances={balances}
                        fairPrice={fairPrice}
                        maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        baseTicker={selectedTracer?.baseTicker ?? defaults.baseTicker}
                        quoteTicker={selectedTracer?.quoteTicker ?? defaults.quoteTicker}
                        filledOrders={filledOrders ?? []}
                    />
                );
            case 1:
                return (
                    <OpenOrders
                        userOrders={omeState?.userOrders ?? []}
                        baseTicker={selectedTracer?.baseTicker ?? defaults.baseTicker}
                        refetch={() => omeDispatch({ type: 'refetchUserOrders' })}
                    />
                );
            case 2:
                return <Fills filledOrders={filledOrders ?? []} />;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <CustomSubNav
                selected={tab}
                setTab={setTab}
                fills={filledOrders?.length ?? 0}
                orders={omeState?.userOrders?.length ?? 0}
            />
            {content()}
        </div>
    );
})`
    border-top: 1px solid #0c3586;
    max-height: 30vh;
    overflow: auto;
` as React.FC<TSProps>;
