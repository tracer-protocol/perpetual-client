import { TradingTable } from '@components/Tables/TradingTable';
import { toApproxCurrency } from '@libs/utils';
import { FilledOrder } from 'types/OrderTypes';
import React from 'react';
import styled from 'styled-components';

const STradingTable = styled(TradingTable)`
    tbody {
        max-height: 100%;
    }

    thead {
        margin-bottom: 10px;
    }

    td {
        text-align: right;
        padding-right: 40px;
    }
`;
interface RTProps {
    trades: FilledOrder[];
    className?: string;
}

const RecentTrades: React.FC<RTProps> = styled(({ trades, className }: RTProps) => {
    return (
        <div className={className}>
            <h3>Recent Trades</h3>
            {trades?.length ? (
                <div className="h-full">
                    <STradingTable>
                        <thead>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Time</th>
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
                                        <td>
                                            {d.getHours()}:{d.getMinutes()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </STradingTable>
                </div>
            ) : (
                <p>No recent trades</p>
            )}
        </div>
    );
})`
    padding: 10px 0 10px 10px;
    height: 100%;
    position: relative;
    display: flex;
    overflow: auto;
    flex-direction: column;
    border-top: 1px solid var(--color-accent);
    h3 {
        font-size: var(--font-size-medium);
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
        margin-bottom: 10px;
    }
`;

export default RecentTrades;
