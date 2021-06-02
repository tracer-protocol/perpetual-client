import React, { useState, useContext } from 'react';
import SubNav from '@components/Nav/SubNav';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Web3Context } from '@context/Web3Context';
import { Table, TRow, TData } from '@components/General/Table';
import { calcStatus, timeAgo, toApproxCurrency } from '@libs/utils';
import Web3 from 'web3';
import { useUsersMatched } from '@libs/Graph/hooks/Account';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { FilledOrder } from 'types/OrderTypes';
import {
    calcLeverage,
    calcLiquidationPrice,
    calcProfitableLiquidationPrice,
    calcNotionalValue,
} from '@tracer-protocol/tracer-utils';
import { Button, Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import { TransactionContext } from '@context/TransactionContext';
import { cancelOrder } from '@libs/Ome';
import { OMEContext } from '@context/OMEContext';

interface IProps {
    balance: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    baseTicker: string;
}

const PositionDetails: React.FC<IProps> = ({ balance, fairPrice, maxLeverage, baseTicker }: IProps) => {
    const { base, quote, totalLeveragedValue } = balance;
    const l = calcLeverage(quote, base, fairPrice);
    return (
        <div className="flex">
            <div className="w-1/2 p-3">
                <Section label={'Eligible liquidation price (exc. gas)'}>
                    {toApproxCurrency(calcLiquidationPrice(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={'Likely Liquidation Price (incl. gas)'}>
                    {toApproxCurrency(calcProfitableLiquidationPrice(quote, base, fairPrice, maxLeverage))}
                </Section>
                <Section label={`${base.lt(0) ? 'Short' : 'Long'} Positions`}>
                    {`${base.abs().toNumber()} ${baseTicker}`}
                </Section>
            </div>
            <div className="w-1/2 p-3">
                <Section label={'Notional Value'}>{toApproxCurrency(calcNotionalValue(base, fairPrice))}</Section>
                <Section label={'Leverage Multiplier'}>{l.gt(1) ? `${l.toNumber()}` : '0'}</Section>
                <Section label={'Borrowed Amount'}>{toApproxCurrency(totalLeveragedValue)}</Section>
            </div>
        </div>
    );
};

const STable = styled(Table)`
    > tbody {
        display: block;
        max-height: 20vh;
        overflow: auto;
    }
    > thead,
    > tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed; /* even columns width , fix width of table too*/
    }
    > thead {
        width: calc(100% - 5px); /* scrollbar is 5px */
    }
`;

const Cancel = styled(Button)`
    height: 28px;
    opacity: 0.8;
    padding: 0;
    width: auto;
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
    const { handleTransaction } = useContext(TransactionContext);
    const _cancelOrder = (market: string, orderId: string) => {
        console.info(`Attempting to cancel order: ${orderId} on market: ${market}`);
        handleTransaction
            ? handleTransaction(cancelOrder, [market, orderId], {
                  statusMessages: {
                      waiting: `Cancelling order: ${orderId} on market ${market} `,
                  },
                  callback: () => refetch(),
              })
            : console.error('Failed to cancel order: Handle transaction not defined');
    };
    return (
        <STable headings={['Status', 'Side', 'Amount', 'Filled', 'Remaining', 'Price', '']}>
            <tbody>
                {userOrders.map((order, index) => {
                    const amount = parseFloat(Web3.utils.fromWei(order.amount.toString())),
                        filled = parseFloat(Web3.utils.fromWei(order.amount.toString())),
                        remaining = amount - filled;
                    return (
                        <TRow key={`open-order-${index}`}>
                            <TData>{calcStatus(order)}</TData>
                            <TData className={order.side.toLowerCase() /** This will be the global .bid or .ask */}>
                                {order.side}
                            </TData>
                            <TData>
                                {amount} {baseTicker}
                            </TData>
                            <TData>
                                {filled} {baseTicker}
                            </TData>
                            <TData>
                                {remaining} {baseTicker}
                            </TData>
                            <TData>{toApproxCurrency(parseFloat(Web3.utils.fromWei(order.price.toString())))}</TData>
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

const Fills: React.FC<{
    filledOrders: FilledOrder[];
}> = React.memo(({ filledOrders }) => {
    return (
        <STable headings={['Time', 'Side', 'Amount', 'Price', 'Total/Fee']}>
            <tbody>
                {filledOrders.map((order, index) => {
                    const now = Date.now();
                    const price = parseFloat(Web3.utils.fromWei(order.price));
                    return (
                        <TRow key={`filled-order-${index}`}>
                            <TData>{timeAgo(now, parseInt(order.timestamp))}</TData>
                            <TData className={!!order.position ? 'bid' : 'ask'}>
                                {!!order.position ? 'Short' : 'Long'}
                            </TData>
                            <TData>{Web3.utils.fromWei(order.amount)}</TData>
                            <TData>{toApproxCurrency(price)}</TData>
                            <TData>{toApproxCurrency(parseFloat(Web3.utils.fromWei(order.amount)) * price)}/$0</TData>
                        </TRow>
                    );
                })}
            </tbody>
        </STable>
    );
});

type TSProps = {
    selectedTracer: Tracer | undefined;
    className?: string;
};

export const AccountSummary: React.FC<TSProps> = styled(({ selectedTracer, className }: TSProps) => {
    const { account } = useContext(Web3Context);
    const [tab, setTab] = useState(0);
    const tabs = [`Position`, `Orders`, `Fills`];
    const balances = selectedTracer?.balances ?? defaults.balances;
    const fairPrice = selectedTracer?.oraclePrice ?? defaults.oraclePrice;
    const { filledOrders } = useUsersMatched(selectedTracer?.address ?? '', account ?? '');
    const { 
        omeState, 
        omeDispatch = () => { console.error("Ome dispatch function not set") }
    } = useContext(OMEContext);

    const baseTicker = 'BTC';
    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <PositionDetails
                        balance={balances}
                        fairPrice={fairPrice}
                        maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        baseTicker={baseTicker}
                    />
                )
            case 1:
                return (
                    <OpenOrders 
                        userOrders={omeState?.userOrders ?? []} 
                        baseTicker={baseTicker} 
                        refetch={() => omeDispatch({ type: 'refetchUserOrders' })} 
                    />
                )
            case 2:
                return <Fills filledOrders={filledOrders} />;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <SubNav tabs={tabs} setTab={setTab} selected={tab} />
            {content()}
        </div>
    );
})`
    border-top: 1px solid #0c3586;
`;
