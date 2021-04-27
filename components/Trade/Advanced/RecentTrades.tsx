import { TradingTable } from '@components/components/Tables/TradingTable';
import { toApproxCurrency } from '@components/libs/utils';
import React from 'react';
import styled from 'styled-components';


type Trade = {
    price: number,
    amount: number,
    time: string,
    bid: boolean
}

interface RTProps {
    trades: Trade[]
    className?: string;
}

const RecentTrades: React.FC<RTProps> = styled(({ trades, className }: RTProps) => {
    return (
        <div className={className}>
            <h3>Recent Trades</h3>
            {trades?.length
                ? 
                    <TradingTable>
                        <thead>
                            <tr>
                                <th>Price</th>
                                <th>Amount</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade: Trade) => 
                                <tr>
                                    <td className={trade.bid ? 'bid' : 'ask'}>
                                        {toApproxCurrency(trade.price)}
                                    </td>
                                    <td>
                                        {trade.amount}
                                    </td>
                                    <td>
                                        {trade.time}
                                    </td>
                                </tr>
                            )}  
                        </tbody>
                    </TradingTable>
                : 
                    <p>
                        No recent trades
                    </p>
            }
        </div>
    )
})`
    padding: 10px;
    height: 100%;
    border-top: 1px solid #002886;
    h3 {
        font-size: 20px;
        letter-spacing: -0.4px;
        color: #FFFFFF;
        text-transform: capitalize;
        margin-bottom: 10px;
    }
`

export default RecentTrades;