import { TradingTable } from '@components/Tables/TradingTable';
import { toApproxCurrency } from '@libs/utils';
import { FilledOrder } from 'types/OrderTypes';
import React from 'react';
import styled from 'styled-components';
interface RTProps {
    trades: FilledOrder[];
    className?: string;
}

const RecentTrades: React.FC<RTProps> = styled(({ trades, className }: RTProps) => {
    return (
        <div className={className}>
            <h3>Recent Trades</h3>
            {trades?.length ? (
                <TradingTable>
                    <thead>
                        <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade, index) => {
                            const d = new Date(parseInt(trade.timestamp) * 1000);
                            return (
                                <tr key={`row-${index}`}>
                                    <td className={!!trade.position ? 'bid' : 'ask'}>
                                        {toApproxCurrency(trade.price)}
                                    </td>
                                    <td>{trade.amount.toPrecision(3)}</td>
                                    <td>
                                        {d.getHours()}:{d.getMinutes()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </TradingTable>
            ) : (
                <p>No recent trades</p>
            )}
        </div>
    );
})`
    padding: 10px;
    height: 100%;
    border-top: 1px solid #002886;
    h3 {
        font-size: 20px;
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
        margin-bottom: 10px;
    }
`;

export default RecentTrades;
