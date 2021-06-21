import React, { useState, useContext } from 'react';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { calcStatus, timeAgo, toApproxCurrency, getPositionText } from '@libs/utils';
import Web3 from 'web3';
import { OMEOrder } from '@tracer-protocol/tracer-utils';
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
import { TableCell, TableHead, TableRow } from '@components/Portfolio';
import { OrderContext } from '@context/OrderContext';

const AccountDetails = styled.div`
    width: 40%;
    display: flex;
    flex-wrap: wrap;
`;
const PositionGraph = styled.div`
    width: 40%;
    padding: 12px;
`;
const GraphLegend = styled.div`
    width: 20%;
    padding: 12px;
`;

const SPrevious = styled(Previous)`
    &:after {
        content: ">>";
    }
`

const SSection = styled(Section)`
    display: block;
    padding: 5px 10px;
    margin: 0;
    color: #005ea4;
    > .label {
        display: block;
        font-size: 12px;
    }
    > .content {
        padding-left: 0;
    }
`;

const SectionContainer = styled.div`
    border-right: 1px solid #002886;
    width: 100%;
    display: block;

    &.exposure {
        border-top: 1px solid #002886;
        border-bottom: 1px solid #002886;
        padding-bottom: 0.25rem;
    }
`;

const SSlideSelect = styled(SlideSelect)`
    height: 28px;
    width: 150px;
    margin-left: 0;
    margin-top: 0.25rem;
`;

const Content = styled.div`
    font-size: 18px;
    color: #fff;
    text-align: left;
`;

type ContentProps = {
    exposure: number,
    tradePrice: number,
    nextPosition: {
        base: BigNumber,
        quote: BigNumber
    },
    balances: UserBalance
}

const Position:React.FC<ContentProps> = ({
    nextPosition ,
    exposure,
    tradePrice,
    balances
}) => {
    if (balances.quote.eq(0)) return <Content>-</Content>
    else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>
                    {getPositionText(balances.base)}
                </SPrevious>
                {getPositionText(nextPosition.base)}
            </Content>
        )
    } // else
    return (
        <Content>
            {getPositionText(balances.base)}
        </Content>
    )
}

const Leverage:React.FC<ContentProps & { fairPrice: BigNumber }> = ({
    nextPosition,
    exposure,
    tradePrice,
    fairPrice,
    balances
}) => {
    const l = calcLeverage(balances.quote, balances.base, fairPrice);
    if (balances.quote.eq(0)) return <Content>-</Content>
    else if (exposure && tradePrice) {
        return (
            <Content>
                <SPrevious>
                    {`${l.toFixed(2)}x`}
                </SPrevious>
                {`${calcLeverage(nextPosition.quote, nextPosition.base, new BigNumber(tradePrice)).toFixed(2)}x`}
            </Content>
        )
    } // else
    return (
        <Content>
            {`${l.toPrecision(3)}x`}
        </Content>
    )

}

interface IProps {
    balance: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
    baseTicker: string;
    quoteTicker: string;
}

const PositionDetails: React.FC<IProps> = ({
    balance,
    fairPrice,
    baseTicker,
    quoteTicker
}: IProps) => {
    const { order } = useContext(OrderContext);
    const [currency, setCurrency] = useState(0); // 0 quoted in base
    const { base } = balance;
    return (
        <div className="flex">
            <AccountDetails>
                <SectionContainer className="w-1/2">
                    <SSection label={'Side'}>
                        <Position
                            balances={balance}
                            nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
                            tradePrice={order?.price ?? 0}
                            exposure={order?.exposure ?? 0}
                        />
                    </SSection>
                    <SSection label={'Leverage'}>
                        <Leverage
                            balances={balance}
                            nextPosition={order?.nextPosition ?? { base: new BigNumber(0), quote: new BigNumber(0) }}
                            tradePrice={order?.price ?? 0}
                            fairPrice={fairPrice}
                            exposure={order?.exposure ?? 0}
                        />
                    </SSection>
                </SectionContainer>
                <SectionContainer className="w-1/2">
                    <SSection
                        label={'Unrealised PnL'}
                        tooltip={{ key: `unrealised-pnl`, props: { baseTicker: baseTicker } }}
                    >
                        {!balance.quote.eq(0) ? <Content>{toApproxCurrency(0)}</Content> : `-`}
                    </SSection>
                    <SSection
                        label={'Realised PnL'}
                        tooltip={{ key: `realised-pnl`, props: { baseTicker: baseTicker } }}
                    >
                        {!balance.quote.eq(0) ? <Content>{toApproxCurrency(0)}</Content> : `-`}
                    </SSection>
                </SectionContainer>
                <SectionContainer className="exposure">
                    <SSection label={'Exposure'} className="w-full">
                        {!balance.quote.eq(0) ? (
                            <Content>
                                {currency === 0
                                    ? `${base.abs().toNumber()} ${baseTicker}`
                                    : `${toApproxCurrency(base.abs().times(fairPrice))} ${quoteTicker}`}
                                <SSlideSelect
                                    onClick={(index, _e) => {
                                        setCurrency(index);
                                    }}
                                    value={currency}
                                >
                                    <Option>{baseTicker}</Option>
                                    <Option>{quoteTicker}</Option>
                                </SSlideSelect>
                            </Content>
                        ) : (
                            `-`
                        )}
                    </SSection>
                </SectionContainer>
            </AccountDetails>
            <PositionGraph />
            <GraphLegend />
        </div>
    );
};

// const STable = styled(Table)`
//     > tbody {
//         display: block;
//         max-height: 15vh;
//         overflow-y: scroll;
//     }
//     > thead {
//         display: table;
//         table-layout: fixed; /* even columns width , fix width of table too*/
//         width: calc(100% - 5px) !important; /* scrollbar is 5px */
//     }
//     > tbody tr {
//         display: table;
//         width: 100%;
//         table-layout: fixed; /* even columns width , fix width of table too*/
//         overflow: auto;
//     }
// `;

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
    const TableHeadTheme = {
        maxWidth: '180px',
        minWidth: '80px',
        width: 'auto',
        borderRight: '1px solid #002886',
        borderBottom: '1px solid #002886',
    };
    const TableHeadEndTheme = {
        minWidth: '200px',
        borderBottom: '1px solid #002886',
    };
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
        <table className="w-full">
            <thead>
                <tr>
                    {['Status', 'Side', 'Price', 'Amount', 'Filled', 'Remaining', ''].map((heading, i) =>
                        i === 6 ? (
                            <TableHead theme={TableHeadEndTheme}>{heading}</TableHead>
                        ) : (
                            <TableHead theme={TableHeadTheme}>{heading}</TableHead>
                        ),
                    )}
                </tr>
            </thead>
            <tbody>
                {userOrders.map((order, index) => {
                    const amount = parseFloat(Web3.utils.fromWei(order?.amount?.toString() ?? '0')),
                        amountLeft = parseFloat(Web3.utils.fromWei(order?.amount_left?.toString() ?? '0')),
                        filled = amount - amountLeft;
                    return (
                        <TableRow key={`open-order-${index}`}>
                            <TableCell>{calcStatus(filled)}</TableCell>
                            <TableCell className={order.side.toLowerCase() /** This will be the global .bid or .ask */}>
                                {order.side}
                            </TableCell>
                            <TableCell>
                                {toApproxCurrency(parseFloat(Web3.utils.fromWei(order.price.toString())))}
                            </TableCell>
                            <TableCell>
                                {amount} {baseTicker}
                            </TableCell>
                            <TableCell>
                                {filled} {baseTicker}
                            </TableCell>
                            <TableCell>
                                {amountLeft} {baseTicker}
                            </TableCell>
                            <TableCell>
                                <Cancel onClick={(_e) => _cancelOrder(order.target_tracer, order.id)}>Cancel</Cancel>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </tbody>
        </table>
    );
});
OpenOrders.displayName = 'OpenOrders';

const Fills: React.FC<{
    filledOrders: FilledOrder[];
}> = React.memo(({ filledOrders }) => {
    const TableHeadEndTheme = {
        minWidth: '200px',
        borderBottom: '1px solid #002886',
    };
    return (
        <table className="w-full">
            <thead>
                <tr>
                    {['Time', 'Side', 'Price', 'Amount'].map((heading, i) =>
                        i === 3 ? (
                            <TableHead theme={TableHeadEndTheme}>{heading}</TableHead>
                        ) : (
                            <TableHead>{heading}</TableHead>
                        ),
                    )}
                </tr>
            </thead>
            <tbody>
                {filledOrders.map((order, index) => {
                    const now = Date.now();
                    const price = order.price;
                    return (
                        <TableRow key={`filled-order-${index}`}>
                            <TableCell>{timeAgo(now, parseInt(order.timestamp) * 1000)}</TableCell>
                            <TableCell className={!!order.position ? 'ask' : 'bid'}>
                                {!!order.position ? 'Short' : 'Long'}
                            </TableCell>
                            <TableCell>{toApproxCurrency(price)}</TableCell>
                            <TableCell>{order.amount.toNumber()}</TableCell>
                            {/*TODO: Fee value*/}
                            {/*<TData>{toApproxCurrency(order.amount.times(price))}/$0</TData>*/}
                        </TableRow>
                    );
                })}
            </tbody>
        </table>
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
                        balance={balances}
                        fairPrice={fairPrice}
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
