import { OMEOrder } from '@components/types/OrderTypes';
import React from 'react';

import { AskOrder, BidOrder } from './Orders';

interface OProps {
    askOrders: OMEOrder[]; //TODO change these
    bidOrders: OMEOrder[];
}

const OrderBook: React.FC<OProps> = ({ askOrders, bidOrders }: OProps) => {
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

    const renderOrders = (ComponentClass: typeof AskOrder | typeof BidOrder, orders: OMEOrder[]) => {
        let cumulative = 0;
        return orders.map((order: OMEOrder, index: number) => {
            order.cumulative = cumulative += order.quantity;
            order.maxCumulative = maxCumulative;
            return <ComponentClass key={index} {...order} />;
        });
    };

    // <thead className="border-b-2 border-blue-300">
    //     <tr className="text-blue-100 font-bold w-full"></tr>
    return (
        <div className="OrderBook overflow-scroll relative">
            <table className="text-xs border-collapse table-fixed text-center w-full">
                <thead className="border-b-2 border-blue-300">
                    <tr className="text-blue-100 font-bold">
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Cumulative</th>
                    </tr>
                </thead>
                <tbody>{renderOrders(AskOrder, askOrdersCopy).reverse()}</tbody>
                <tbody>{renderOrders(BidOrder, bidOrdersCopy)}</tbody>
            </table>
        </div>
    );
};

export default OrderBook;
