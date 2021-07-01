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
import { LIMIT, OrderContext, orderDefaults, OrderState } from '@context/OrderContext';
import { CloseOrderButton } from '@components/Buttons/OrderButton';

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
    padding: 4px 12px;
    margin: 0;
    color: var(--color-secondary);
    min-height: var(--height-small-container);
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

const CloseOrderSection = styled.div`
    display: inline-block;
    position: relative;
    padding: 0 12px;
    padding-top: 8px;
    width: 100%;
    margin: 0;
    color: var(--color-secondary);
`;

const SectionContainer = styled.div`
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
    color: var(--color-text);
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

const LiquidationPrice: React.FC<
    ContentProps & {
        orderType: number;
        fairPrice: BigNumber;
        maxLeverage: BigNumber;
    }
> = ({ exposure, balances, nextPosition, maxLeverage, tradePrice, orderType, fairPrice }) => {
    if (balances.quote.eq(0)) {
        return <>-</>;
    } else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>
                    {toApproxCurrency(
                        parseFloat(
                            calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(2),
                        ),
                    )}
                </SPrevious>
                {toApproxCurrency(
                    parseFloat(
                        calcLiquidationPrice(
                            nextPosition.quote,
                            nextPosition.base,
                            orderType === LIMIT ? new BigNumber(tradePrice) : fairPrice,
                            maxLeverage,
                        ).toFixed(2),
                    ),
                )}
            </Content>
        );
    } // else
    return (
        <Content>
            {toApproxCurrency(
                parseFloat(calcLiquidationPrice(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(2)),
            )}
        </Content>
    );
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
    const [currency, setCurrency] = useState(0); // 0 quoted in base
    const { order } = useContext(OrderContext);
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
                </AccountDetailsSection>
                <AccountDetailsSection label={'Leverage'}>
                    <Leverage
                        balances={balances}
                        nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
                        tradePrice={order?.price ?? 0}
                        fairPrice={fairPrice}
                        orderType={order?.orderType ?? 0}
                        exposure={order?.exposure ?? 0}
                    />
                </AccountDetailsSection>
                <CloseOrderSection>
                    <CloseOrderButton />
                </CloseOrderSection>
            </SectionContainer>
            <SectionContainer className="w-2/6 inline-block">
                <AccountDetailsSection
                    label={'Liquidation Price'}
                    tooltip={{ key: 'liquidation-price', props: { quote: balances.quote, position: order?.position } }}
                >
                    <LiquidationPrice
                        balances={balances}
                        tradePrice={order?.price ?? 0}
                        fairPrice={fairPrice}
                        nextPosition={order?.nextPosition ?? defaults.balances}
                        orderType={order?.orderType ?? 0}
                        exposure={order?.exposure ?? 0}
                        maxLeverage={maxLeverage}
                    />
                </AccountDetailsSection>
                <AccountDetailsSection label={'Fair Price'}>
                    {!balances.quote.eq(0) ? <Content>{toApproxCurrency(fairPrice)}</Content> : `-`}
                </AccountDetailsSection>
            </SectionContainer>
            <SectionContainer className="w-2/6">
                <AccountDetailsSection
                    className="b-r-none"
                    label={'Unrealised PnL'}
                    tooltip={{ key: `unrealised-pnl`, props: { baseTicker: baseTicker } }}
                >
                    {!balances.quote.eq(0) ? (
                        <Content>{toApproxCurrency(calcUnrealised(base, fairPrice, filledOrders), 3)}</Content>
                    ) : (
                        `-`
                    )}
                </AccountDetailsSection>
                <AccountDetailsSection
                    className="b-r-none"
                    label={'Realised PnL'}
                    tooltip={{ key: `realised-pnl`, props: { baseTicker: baseTicker } }}
                >
                    -
                </AccountDetailsSection>
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
                                {parseFloat(amount.toFixed(2))} {baseTicker}
                            </TData>
                            <TData>
                                {parseFloat(filled.toFixed(2))} {baseTicker}
                            </TData>
                            <TData>
                                {parseFloat(amountLeft.toFixed(2))} {baseTicker}
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
    filledOrders.sort((order1, order2) => (order1.timestamp < order2.timestamp && 1) || -1);
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
                            <TData>{parseFloat(order.amount.toFixed(2))}</TData>
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
    max-height: 32vh;
    overflow: auto;
` as React.FC<TSProps>;
