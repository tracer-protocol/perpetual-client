import React, { FC, useState, useContext } from 'react';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Table, TRow, TData } from '@components/General/Table';
import { calcStatus, timeAgo, toApproxCurrency } from '@libs/utils';
import Web3 from 'web3';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { FilledOrder } from 'libs/types/OrderTypes';
import { Button } from '@components/General';
import { TransactionContext } from '@context/TransactionContext';
import { cancelOrder } from '@libs/Ome';
import { OMEContext } from '@context/OMEContext';
import CustomSubNav from './CustomSubNav';
import PositionTab from '@components/Trade/Advanced/RightPanel/AccountSummary/Position';

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

const OrdersTab: React.FC<{
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
OrdersTab.displayName = 'OpenOrders';

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

const AccountSummary: FC<TSProps> = styled(({ selectedTracer, className }: TSProps) => {
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
                    <PositionTab
                        balances={balances}
                        fairPrice={fairPrice}
                        baseTicker={selectedTracer?.baseTicker ?? defaults.baseTicker}
                        quoteTicker={selectedTracer?.quoteTicker ?? defaults.quoteTicker}
                        filledOrders={filledOrders ?? []}
                    />
                );
            case 1:
                return (
                    <OrdersTab
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
    height: 50vh;
    overflow: auto;
`;

export default AccountSummary;
