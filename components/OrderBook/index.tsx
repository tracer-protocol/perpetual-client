import React, { useState, useCallback } from 'react';
import { OMEOrder } from 'types/OrderTypes';
import styled from 'styled-components';
import { toApproxCurrency } from '@libs/utils';
import BigNumber from 'bignumber.js';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';
import { Menu, MenuItem } from '@components/General/Menu';

interface OProps {
    askOrders: OMEOrder[]; //TODO change these
    bidOrders: OMEOrder[];
    lastTradePrice: number | BigNumber;
    marketUp: boolean; // true if the last tradePrice is previous than the tradePrice before that
    className?: string;
}

const decimalKeyMap: Record<number, number> = {
    1: 0.01,
    2: 0.1,
    3: 1,
    4: 10,
    5: 50,
    6: 100
}

export default styled(
    ({ askOrders, bidOrders, lastTradePrice, marketUp, className }: OProps) => {
        const [decimals, setDecimals] = useState(1);

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

        const renderOrders = useCallback((bid: boolean, orders: OMEOrder[]) => {
            if (!orders.length) {
                return (
                    <BookRow>
                        <Item className="py-1"></Item>
                    </BookRow>
                );
            } // return an empty row
            const rows = [];
            let cumulative = 0;
            let exit = false;
            for (let i = 0; i < orders.length; i++) {
                if (rows.length >= 8) break;
                let order = orders[i];
                // round to the nearest bracket below current price for bid and above for ask
                let bracket = bid 
                    ? Math.floor((order.price)/decimalKeyMap[decimals])*decimalKeyMap[decimals] 
                    : Math.ceil((order.price)/decimalKeyMap[decimals])*decimalKeyMap[decimals]; 
                let innerCumulative = 0;
                for (let p = i; p < orders.length; p++) {
                    if (
                        (bid && orders[p].price <= bracket) ||
                        (!bid && orders[p].price >= bracket)
                    ) {
                        i = p;
                        break;
                    }
                    innerCumulative += orders[i].quantity;
                    if (p === orders.length - 1) {
                        exit = true;
                    }
                }
                cumulative += innerCumulative;
                rows.push(
                    <Order
                        bid={bid}
                        price={bracket}
                        cumulative={cumulative}
                        quantity={innerCumulative}
                        maxCumulative={maxCumulative}
                    />
                )
                if (exit) break;
            }
            return !bid ? rows.reverse() : rows;
        }, [decimals]);

        return (
            <div className={className}>
                <PrecisionDropdown
                    setDecimals={setDecimals}
                    decimals={decimals}
                />
                <BookRow>
                    <Item>Price</Item>
                    <Item>Quantity</Item>
                    <Item>Cumulative</Item>
                </BookRow>
                {renderOrders(false, askOrdersCopy)}
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
                {renderOrders(true, bidOrdersCopy)}
            </div>
        );
    },
)`
    height: 100%;
` as React.FC<OProps>;

const Item = styled.div`
    width: 100%;
    white-space: nowrap;
    margin: 0 0.8rem;
`;

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
`;

const MarketRow = styled(BookRow)`
    background: var(--color-background-secondary);
    padding: 0.5rem 0;
`;

const getPercentage: (cumulative: number, maxCumulative?: number) => number = (
    cumulative,
    maxCumulative,
) => {
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
    decimals: number;
    bid: boolean;
    className?: string;
}

const Order: React.FC<BProps> = ({
    className,
    cumulative,
    quantity,
    price,
    maxCumulative,
    bid,
}: BProps) => {
    return (
        <BookRow className={className}>
            <Item className={`${bid ? 'bid' : 'ask'}`}>
                {toApproxCurrency(price)}
            </Item>
            <Item>{quantity.toFixed(3)}</Item>
            <Item
                className={`fill-${bid ? 'bid' : 'ask'}`}
                style={{
                    backgroundSize:
                        getPercentage(cumulative, maxCumulative) + '% 100%',
                }}
            >
                {cumulative.toFixed(3)}
            </Item>
        </BookRow>
    );
};

const StyledTriangleDown = styled.img`
    height: 0.5rem;
    transition: all 400ms ease-in-out;
    display: inline;
    margin-left: 0.2rem;
    &.rotate {
        transform: rotate(180deg);
        margin-top: -2px;
    }
`;

const PrecisionDropdownButton = styled(Button)`
    height: var(--height-small-button);
    padding: 0;
    max-width: 5rem;
`;

type PDProps = {
    setDecimals: (val: number) => void;
    decimals: number;
    className?: string;
};

const PrecisionDropdown: React.FC<PDProps> = styled(
    ({ className, decimals, setDecimals }: PDProps) => {
        const [rotated, setRotated] = useState(false);
        const menu = (
            <Menu
                onClick={({ key }: any) => {
                    setDecimals(parseInt(key));
                    setRotated(false);
                }}
            >
                {Object.keys(decimalKeyMap).map((key) => {
                    return (
                        <MenuItem key={key}>
                            <span>{decimalKeyMap[parseInt(key)]}</span>
                        </MenuItem>
                    )
                })}
            </Menu>
        );
        const handleVisibleChange = (visible: boolean) => {
            setRotated(visible);
        };
        return (
            <Dropdown
                className={className}
                overlay={menu}
                placement="bottomCenter"
                onVisibleChange={handleVisibleChange}
            >
                <PrecisionDropdownButton>
                    {decimalKeyMap[decimals]}
                    <StyledTriangleDown
                        className={rotated ? 'rotate' : ''}
                        src="/img/general/triangle_down_cropped.svg"
                    />
                </PrecisionDropdownButton>
            </Dropdown>
        );
    },
)`
    position: absolute;
    right: 0;
    top: 0;
    margin: 0.5rem;
`;
