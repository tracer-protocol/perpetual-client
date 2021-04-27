import { OMEOrder } from '@components/types/OrderTypes';
import React from 'react';

import { Order } from './Orders';
import styled from 'styled-components';
import { TradingTable } from '../Tables/TradingTable';
interface OProps {
    askOrders: OMEOrder[]; //TODO change these
    bidOrders: OMEOrder[];
    className?: string;
}



const OrderBook: React.FC<OProps> = styled(({ askOrders, bidOrders, className}: OProps) => {
    const sumQuantities = (orders: OMEOrder[]) => {
        return orders.reduce((total, order) => total + order.quantity, 0);
    };

    const totalAsks = sumQuantities(askOrders);
    const totalBids = sumQuantities(bidOrders);
    const maxCumulative = Math.max(totalAsks, totalBids);

    const deepCopyArrayOfObj = (arr: OMEOrder[]) => arr.map((order) => Object.assign({}, order));

    // Deep copy and sort orders
    const askOrdersCopy = deepCopyArrayOfObj(askOrders).sort((a, b) => a.price - b.price); // ascending order
    const bidOrdersCopy = deepCopyArrayOfObj(bidOrders).sort((a, b) => b.price - a.price); // descending order

    const renderOrders = (bid: boolean, orders: OMEOrder[]) => {
        let cumulative = 0;
        return orders.map((order: OMEOrder, index: number) => {
            order.cumulative = cumulative += order.quantity;
            order.maxCumulative = maxCumulative;
            return <Order bid={bid} key={index} {...order} />;
        });
    };
    return (
        <div className={className}>
            <TradingTable>
                <thead>
                    <tr>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Cumulative</th>
                    </tr>
                </thead>
                <tbody>{renderOrders(false, askOrdersCopy).reverse()}</tbody>
                <tbody>
                    <tr>
                        <td>Market</td>
                        <td />
                        <td className="market-swing"></td>
                    </tr>
                </tbody>
                <tbody>{renderOrders(true, bidOrdersCopy)}</tbody>
            </TradingTable>
        </div>
    );
})`
    position: relative; 
    overflow-y: scroll;

`

export default OrderBook;
