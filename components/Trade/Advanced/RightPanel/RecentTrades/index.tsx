import { TradingTable } from '@components/Tables/TradingTable';
import { toApproxCurrency } from '@libs/utils';
import { FilledOrder } from 'libs/types/OrderTypes';
import React, { useState } from 'react';
import styled from 'styled-components';
import FogOverlay from '@components/Overlay/FogOverlay';
// @ts-ignore
import TracerLoading from '@public/img/logos/tracer/tracer_loading.svg';
import Icon from '@ant-design/icons';

const STradingTable = styled(TradingTable)`
    tbody {
        max-height: 100%;
        margin: 0;
        padding-right: 0;
    }

    thead {
        text-align: left;
        margin-bottom: 5px;
    }

    .time-header {
        text-align: right;
        padding-right: 15px;
    }

    .time-cell {
        text-align: right;
        padding-right: 10px;
    }
`;
interface RTProps {
    trades: FilledOrder[];
    displayTrades: boolean;
}
const RecentTrades: React.FC<RTProps> = ({ trades, displayTrades }: RTProps) => {
    const [showOverlay, setOverlay] = useState(true);

    return (
        <RecentTradesContainer displayTrades={displayTrades}>
            <RecentTradesTitle>Recent Trades</RecentTradesTitle>
            {trades?.length ? (
                <TableContainer>
                    <STradingTable>
                        <thead>
                            <th>Price</th>
                            <th>Amount</th>
                            <th className="time-header">Time</th>
                        </thead>
                        <tbody>
                            {trades.map((trade, index) => {
                                // remove duplicate as for every long there is a short;
                                if (trade.position) {
                                    return;
                                }
                                const d = new Date(parseInt(trade.timestamp) * 1000);
                                return (
                                    <tr key={`row-${index}`}>
                                        <td>{toApproxCurrency(parseFloat(trade.price.toFixed(2)))}</td>
                                        <td>{parseFloat(trade.amount.toFixed(2))}</td>
                                        <td className="time-cell">
                                            {d.getHours()}:{d.getMinutes()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </STradingTable>
                </TableContainer>
            ) : (
                <Icon component={TracerLoading} className="tracer-loading" />
            )}
            {showOverlay ? <FogOverlay buttonName="Show Recent Trades" onClick={() => setOverlay(false)} /> : null}
        </RecentTradesContainer>
    );
};

export default RecentTrades;

const RecentTradesContainer = styled.div<{ displayTrades: boolean }>`
    height: 100%;
    position: relative;
    overflow: auto;
    flex-direction: column;
    border-top: 1px solid var(--color-accent);
    display: flex;
    @media (max-height: 850px) {
        display: ${(props) => (props.displayTrades ? 'flex' : 'none')};
    }
`;

const RecentTradesTitle = styled.div`
    font-size: var(--font-size-medium);
    letter-spacing: -0.4px;
    color: #ffffff;
    text-transform: capitalize;
    padding: 10px 0 0 10px;
`;

const TableContainer = styled.div`
    height: 100%;
    padding: 10px 0 10px 10px;
`;
