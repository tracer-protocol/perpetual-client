import React from 'react';
import { OMEOrder } from 'types/OrderTypes';
import styled from 'styled-components';
import { toApproxCurrency } from '@libs/utils';
import BigNumber from 'bignumber.js';

interface OProps {
    askOrders: OMEOrder[]; //TODO change these
    bidOrders: OMEOrder[];
    lastTradePrice: number | BigNumber;
    marketUp: boolean; // true if the last tradePrice is previous than the tradePrice before that
    className?: string;

}

export default styled(({ askOrders, bidOrders, lastTradePrice, marketUp, className }: OProps) => {

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
        if (!orders.length) return <BookRow><Item className="py-1"></Item></BookRow>// return an empty row
        return orders.map((order: OMEOrder, index: number) => {
            order.cumulative = cumulative += order.quantity;
            order.maxCumulative = maxCumulative;
            return <Order bid={bid} key={index} {...order} />;
        });
    };

    return (
        <div className={className}>
            <BookRow>
                <Item>Price</Item>
                <Item>Quantity</Item>
                <Item>Cumulative</Item>
            </BookRow>
            {renderOrders(false, askOrdersCopy.slice(0, 6).reverse())}
            <MarketRow>
                <Item>
                    {`Best `} 
                    <span className="ask px-1">
                        {toApproxCurrency(askOrdersCopy[0]?.price)}
                    </span>
                    {` / `}
                    <span className="bid px-1">
                        {toApproxCurrency(bidOrdersCopy[0]?.price)}
                    </span>
                </Item>
                <Item className="text-right">
                    {`Last`}
                    <span className={`${marketUp ? 'bid' : 'ask'} pl-1`}>
                    {toApproxCurrency(lastTradePrice)}
                    </span>
                </Item>
            </MarketRow>
            {renderOrders(true, bidOrdersCopy.slice(0, 6))}
        </div>
    );
})`
    height: 100%;
` as React.FC<OProps>;

const Item = styled.div`
    width: 100%;
    white-space: nowrap;
    margin: 0 0.8rem;
`

const BookRow = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    border-bottom: 2px solid var(--color-background);
    text-align: left;
    font-size: var(--font-size-small);
    line-height: var(--font-size-small);
    padding: 1px 0; 
    letter-spacing: -0.32px;

    ${Item}.fill-bid {
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-image: linear-gradient(to left, #00ff0866 100%, white 0%);
        background-size: 0%;
    }

    ${Item}.fill-ask {
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-image: linear-gradient(to left, #f1502566 100%, white 0%);
        background-size: 0%;
    }
`

const MarketRow = styled(BookRow)`
    background: var(--color-background-secondary);
    padding: 0.5rem 0;
`

const getPercentage: (cumulative: number, maxCumulative?: number) => number = (cumulative, maxCumulative) => {
    let fillPercentage = (maxCumulative ? cumulative / maxCumulative : 0) * 100;
    fillPercentage = Math.min(fillPercentage, 100); // Percentage can't be greater than 100%
    fillPercentage = Math.max(fillPercentage, 0); // Percentage can't be smaller than 0%
    return fillPercentage;
};

interface BProps {
    cumulative: number;
    quantity: number;
    price: number;
    maxCumulative?: number;
    bid: boolean;
    className?: string;
}

const Order: React.FC<BProps> = (({ className, cumulative, quantity, price, maxCumulative, bid }: BProps) => {
    return (
        <BookRow className={className}>
            <Item className={`${bid ? 'bid' : 'ask'}`}>{toApproxCurrency(price, 3)}</Item>
            <Item>{quantity.toFixed(3)}</Item>
            <Item
                className={`fill-${bid ? 'bid' : 'ask'}`}
                style={{ backgroundSize: getPercentage(cumulative, maxCumulative) + '% 100%' }}
            >
                {cumulative.toFixed(3)}
            </Item>
        </BookRow>
    );
});

