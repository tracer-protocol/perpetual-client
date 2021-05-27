import React, { useState, useContext } from 'react';
import { SubNav } from '@components/Nav/SubNavBar';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { useOpenOrders } from '@libs/Ome';
import { Web3Context } from '@context/Web3Context';
import { Table, TRow, TData } from '@components/General/Table';
import { timeAgo, toApproxCurrency } from '@libs/utils';
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
import { Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';

interface IProps {
    balance: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
}

const PositionDetails: React.FC<IProps> = ({ balance, fairPrice, maxLeverage }: IProps) => {
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
                <Section label={'Positions'}>{base.toNumber()}</Section>
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

const OpenOrders: React.FC<{
    userOrders: OMEOrder[];
}> = ({ userOrders }) => {
    return (
        <STable headings={['Status', 'Side', 'Amount/Filled', 'Price']}>
            <tbody>
                {userOrders.map((order, index) => (
                    <TRow key={`open-order-${index}`}>
                        <TData>Open</TData>
                        <TData className={order.side.toLowerCase() /** This will be the global .bid or .ask */}>
                            {order.side}
                        </TData>
                        <TData>
                            {Web3.utils.fromWei(order.amount.toString())}/{Web3.utils.fromWei(order.amount.toString())}
                        </TData>
                        <TData>{toApproxCurrency(parseFloat(Web3.utils.fromWei(order.price.toString())))}</TData>
                    </TRow>
                ))}
            </tbody>
        </STable>
    );
};

const Fills: React.FC<{
    filledOrders: FilledOrder[];
}> = ({ filledOrders }) => {
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
};

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
    const userOrders = useOpenOrders(selectedTracer?.address ?? '', account ?? '');
    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <PositionDetails
                        balance={balances}
                        fairPrice={fairPrice}
                        maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                    />
                );
            case 1:
                return <OpenOrders userOrders={userOrders} />;
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
