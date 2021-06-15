import React, { useState, useContext } from 'react';
import SubNav from '@components/Nav/SubNav';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Web3Context } from '@context/Web3Context';
import { Table, TRow, TData } from '@components/General/Table';
import { calcStatus, timeAgo, toApproxCurrency } from '@libs/utils';
import Web3 from 'web3';
import { useUsersMatched } from '@libs/Graph/hooks/Account';
import { calcUnrealised, OMEOrder } from '@tracer-protocol/tracer-utils';
import { FilledOrder } from 'types/OrderTypes';
import {
    calcLeverage,
    calcLiquidationPrice,
} from '@tracer-protocol/tracer-utils';
import { Button, Section } from '@components/General';
import { UserBalance } from 'types';
import { BigNumber } from 'bignumber.js';
import { TransactionContext } from '@context/TransactionContext';
import { cancelOrder } from '@libs/Ome';
import { OMEContext } from '@context/OMEContext';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';

const AccountDetails = styled.div`
    width: 40%;
    display: flex;
    flex-wrap: wrap;
`
const PositionGraph = styled.div`
    width: 40%;
    padding: 12px;
`
const GraphLegend = styled.div`
    width: 20%;
    padding: 12px;
`

const SSection = styled(Section)`
    display: block;
    padding: 5px 10px;
    margin: 0;
    color: #005EA4;
    width: 50%;
    > .label {
        display: block;
        font-size: 12px;
    }
    > .content {
        padding-left: 0;
    }
`
const SSlideSelect = styled(SlideSelect)`
    height: 28px;
    width: 120px;
    margin-left: 0;
    margin-top: 0.25rem;
`
interface IProps {
    balance: UserBalance;
    price: BigNumber;
    maxLeverage: BigNumber;
    baseTicker: string;
    quoteTicker: string;
}

const PositionDetails: React.FC<IProps> = ({ 
    balance, price, maxLeverage, baseTicker, quoteTicker
}: IProps) => {
    const [currency, setCurrency] = useState(0); // 0 quoted in base
    const { base, quote } = balance;
    const l = calcLeverage(quote, base, price);

    return (
        <div className="flex">
            <AccountDetails>
                <SSection label={'Side'}>
                    {!balance.quote.eq(0)
                        ? `${balance.quote.lt(0) ? 'SHORT' : 'LONG'}`
                        : `-`
                    }
                </SSection>
                <SSection label={'Unrealised PnL'}>
                    {!balance.quote.eq(0)
                        ? `${toApproxCurrency(0)}`
                        : `-`
                    }
                </SSection>
                <SSection label={'Leverage'}>
                    {!balance.quote.eq(0)
		                ? `${l.toPrecision(3)}x`
                        : `-`
                    }
                </SSection>
                <SSection label={'Realised PnL'}>
                    {!balance.quote.eq(0)
		                ? `${toApproxCurrency(0)}`
                        : `-`
                    }
                </SSection>
                <SSection label={'Exposure'} className="w-full">
                    {!balance.quote.eq(0)
		                ?   
                            <>
                                {currency === 0
                                    ? `${base.toNumber()} ${baseTicker}`
                                    : `${toApproxCurrency(base.times(price))} ${quoteTicker}`
                                
                                }
                                <SSlideSelect
                                    onClick={(index, _e) => {
                                        setCurrency(index);
                                    }}
                                    value={currency}
                                >
                                    <Option>
                                        {baseTicker}
                                    </Option>
                                    <Option>
                                        {quoteTicker}
                                    </Option>
                                </SSlideSelect>
                            </>
                        : `-`
                    }
                </SSection>
            </AccountDetails>
            <PositionGraph>
            </PositionGraph>
            <GraphLegend />
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
        <STable headings={['Status', 'Side', 'Amount', 'Filled', 'Remaining', 'Price', '']}>
            <tbody>
                {userOrders.map((order, index) => {
                    const amount = parseFloat(Web3.utils.fromWei(order.amount.toString())),
                        amountLeft = parseFloat(Web3.utils.fromWei(order.amount_left.toString())),
                        filled = amount - amountLeft;
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
                                {amountLeft} {baseTicker}
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
OpenOrders.displayName = 'OpenOrders';

const Fills: React.FC<{
    filledOrders: FilledOrder[];
}> = React.memo(({ filledOrders }) => {
    return (
        <STable headings={['Time', 'Side', 'Amount', 'Price', 'Total/Fee']}>
            <tbody>
                {filledOrders.map((order, index) => {
                    const now = Date.now();
                    const price = order.price;
                    return (
                        <TRow key={`filled-order-${index}`}>
                            <TData>{timeAgo(now, parseInt(order.timestamp))}</TData>
                            <TData className={!!order.position ? 'ask' : 'bid'}>
                                {!!order.position ? 'Short' : 'Long'}
                            </TData>
                            <TData>{order.amount.toNumber()}</TData>
                            <TData>{toApproxCurrency(price)}</TData>
                            <TData>{toApproxCurrency(order.amount.times(price))}/$0</TData>
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
    const { account } = useContext(Web3Context);
    const [tab, setTab] = useState(0);
    const tabs = [`Position`, `Orders`, `Fills`];
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const price = selectedTracer?.oraclePrice ?? defaults.oraclePrice;
    const { filledOrders } = useUsersMatched(selectedTracer?.address ?? '', account ?? '');
    const {
        omeState,
        omeDispatch = () => {
            console.error('OME dispatch is underfined');
        },
    } = useContext(OMEContext);

    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <PositionDetails
                        balance={balances}
                        price={price}
                        maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        baseTicker={selectedTracer?.baseTicker ?? defaults.baseTicker}
                        quoteTicker={selectedTracer?.quoteTicker ?? defaults.quoteTicker}
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
    max-height: 30vh;
    overflow: scroll;
` as React.FC<TSProps>;
