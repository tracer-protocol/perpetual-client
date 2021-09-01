import { toApproxCurrency } from '@libs/utils';
import { FilledOrder } from '@libs/types/OrderTypes';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import FogOverlay from '@components/Overlay/FogOverlay';
// @ts-ignore
import TracerLoading from '@public/img/logos/tracer/tracer_loading.svg';
import Icon from '@ant-design/icons';
import {
    RecentTradesTable,
    TableBody,
    TableCell,
    TableHeader,
    TableHeading,
    TableRow,
} from '@components/General/Table';
import { TracerContext } from '@context/TracerContext';
import { OrderContext } from '@context/OrderContext';

interface RTProps {
    trades: FilledOrder[];
    displayTrades: boolean;
}
const RecentTrades: React.FC<RTProps> = ({ trades, displayTrades }: RTProps) => {
    const { selectedTracer } = useContext(TracerContext);
    const { order } = useContext(OrderContext);
    const [showOverlay, setOverlay] = useState(true);

    return (
        <RecentTradesContainer displayTrades={displayTrades}>
            <RecentTradesTitle>Recent Trades</RecentTradesTitle>
            {trades?.length ? (
                <RecentTradesTable>
                    <TableHeader>
                        <TableHeading>Price {selectedTracer?.baseTicker}</TableHeading>
                        <TableHeading>Amount</TableHeading>
                        <TableHeading>Time</TableHeading>
                    </TableHeader>
                    <TableBody>
                        {trades.map((trade, index) => {
                            // remove duplicate as for every long there is a short;
                            if (trade.position) {
                                return;
                            }
                            const d = new Date(parseInt(trade.timestamp) * 1000);
                            return (
                                <TableRow key={`row-${index}`}>
                                    <TableCell>{toApproxCurrency(parseFloat(trade.price.toFixed(2)))}</TableCell>
                                    <TableCell>{trade.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {d.getHours()}:{d.getMinutes()}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </RecentTradesTable>
            ) : (
                <Icon component={TracerLoading} className="tracer-loading" />
            )}
            {showOverlay ? (
                <FogOverlay
                    buttonName="Show Recent Trades"
                    onClick={() => setOverlay(false)}
                    show={!!order?.exposureBN.toNumber() || !!selectedTracer?.getBalance()?.quote.eq(0)}
                />
            ) : null}
        </RecentTradesContainer>
    );
};

export default RecentTrades;

const RecentTradesTitle = styled.div`
    font-size: var(--font-size-small-heading);
    font-weight: bold;
    letter-spacing: var(--letter-spacing-extra-small);
    color: #ffffff;
    text-transform: capitalize;
    padding: 10px 0 10px 10px;
`;

const RecentTradesContainer = styled.div<{ displayTrades: boolean }>`
    height: 100%;
    position: relative;
    overflow: auto;
    flex-direction: column;
    border-top: 1px solid var(--color-accent);
    display: flex;

    @media (max-height: 1080px) {
        display: ${(props) => (props.displayTrades ? 'flex' : 'none')};
        ${RecentTradesTitle} {
            display: none;
        }
    }
`;
