import { OMEOrder } from 'types/OrderTypes';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Order } from './Orders';
import { TradingTable } from '@components/Tables/TradingTable';

const ROW_HEIGHT = 25; // each row is 25
interface OProps {
    askOrders: OMEOrder[]; //TODO change these
    bidOrders: OMEOrder[];
    className?: string;
}

const OrderBook: React.FC<OProps> = styled(
    ({ askOrders, bidOrders, className }: OProps) => {
        const [hasScrolled, setHasScrolled] = useState(false);
        const sumQuantities = (orders: OMEOrder[]) => {
            return orders.reduce((total, order) => total + order.quantity, 0);
        };

        const totalAsks = sumQuantities(askOrders);
        const totalBids = sumQuantities(bidOrders);
        const maxCumulative = Math.max(totalAsks, totalBids);

        const deepCopyArrayOfObj = (arr: OMEOrder[]) =>
            arr.map((order) => Object.assign({}, order));

        // Deep copy and sort orders
        const askOrdersCopy = deepCopyArrayOfObj(askOrders).sort(
            (a, b) => a.price - b.price,
        ); // ascending order
        const bidOrdersCopy = deepCopyArrayOfObj(bidOrders).sort(
            (a, b) => b.price - a.price,
        ); // descending order

        const renderOrders = (bid: boolean, orders: OMEOrder[]) => {
            let cumulative = 0;
            return orders.map((order: OMEOrder, index: number) => {
                order.cumulative = cumulative += order.quantity;
                order.maxCumulative = maxCumulative;
                return <Order bid={bid} key={index} {...order} />;
            });
        };

        useEffect(() => {
            const tableBody = document.getElementById('trading-table-body');
            const setter = (_e: any) => {
                setHasScrolled(true);
                tableBody?.removeEventListener('scroll', setter);
            };
            tableBody?.addEventListener('scroll', setter);
        }, []);

        useEffect(() => {
            const tableBody = document.getElementById('trading-table-body');
            if (tableBody && !hasScrolled) {
                const middle = document.getElementById('market-middle');
                if (middle) {
                    const scrollTo =
                        middle.offsetTop -
                        tableBody.offsetHeight / 2 -
                        ROW_HEIGHT;
                    tableBody.scrollTo(0, scrollTo);
                }
            }
        }, [askOrders, bidOrders]);
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
                    <tbody id="trading-table-body">
                        {renderOrders(false, askOrdersCopy).reverse()}
                        <tr id="market-middle">
                            <td>Market</td>
                            <td />
                            <td />
                            {/* <MarketChange amount={0} /> */}
                        </tr>
                        {renderOrders(true, bidOrdersCopy)}
                    </tbody>
                </TradingTable>
            </div>
        );
    },
)`
    height: 100%;
`;

export default OrderBook;
