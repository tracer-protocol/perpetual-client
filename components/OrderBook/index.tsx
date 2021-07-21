import React, { FC, useState, useCallback, useContext } from 'react';
import { OMEOrder } from 'libs/types/OrderTypes';
import styled from 'styled-components';
import { toApproxCurrency } from '@libs/utils';
import BigNumber from 'bignumber.js';
import Dropdown from 'antd/lib/dropdown';
import { Button } from '@components/General';
import { Menu, MenuItem } from '@components/General/Menu';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import FogOverlay from '@components/Overlay/FogOverlay';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from '@public/img/logos/tracer/tracer_loading.svg';
import { LIMIT, OrderContext, SHORT, LONG } from '@context/OrderContext';

const decimalKeyMap: Record<number, number> = {
    1: 0.01,
    2: 0.1,
    3: 1,
    4: 10,
    5: 50,
    6: 100,
};

type OrderInfo = {
    bid: boolean;
    price: number;
    quantity: number;
};

interface OProps {
    askOrders: OMEOrder[] | undefined;
    bidOrders: OMEOrder[] | undefined;
    lastTradePrice: BigNumber;
    marketUp: boolean; // true if the last tradePrice is previous than the tradePrice before that
    decimals: number;
    displayBook: boolean;
    setDecimals: React.Dispatch<React.SetStateAction<number>>;
    className?: string;
}

const OrderBook: FC<OProps> = styled(
    ({ askOrders, bidOrders, lastTradePrice, marketUp, decimals, setDecimals, className }: OProps) => {
        const { orderDispatch = () => console.error('Order dispatch not set') } = useContext(OrderContext);
        const [showOrderBook, setShowOrderBook] = useState(true);
        const [showOverlay, setOverlay] = useState(true);

        const sumQuantities = (orders: OMEOrder[]) => {
            return orders.reduce((total, order) => total + order.quantity, 0);
        };

        const deepCopyArrayOfObj = (arr: OMEOrder[]) => arr.map((order) => Object.assign({}, order));

        const setOrderFromBook: (order: OrderInfo) => void = (order) => {
            orderDispatch({ type: 'setOrderType', value: LIMIT });
            orderDispatch({ type: 'setExposure', value: parseFloat(order.quantity.toFixed(2)) });
            orderDispatch({ type: 'setPosition', value: order.bid ? SHORT : LONG });
            orderDispatch({
                type: 'setPrice',
                value: Number.isNaN(order.price) ? 0 : parseFloat(order.price.toFixed(2)),
            });
        };
        // Deep copy and sort orders
        const askOrdersCopy = deepCopyArrayOfObj(askOrders ?? []).sort((a, b) => a.price - b.price); // ascending order
        const bidOrdersCopy = deepCopyArrayOfObj(bidOrders ?? []).sort((a, b) => b.price - a.price); // descending order

        const renderOrders = useCallback(
            (bid: boolean, orders: OMEOrder[]) => {
                if (!orders.length) {
                    return (
                        <BookRow key={'empty-book-row'}>
                            <Item className="py-1" />
                        </BookRow>
                    );
                } // return an empty row
                const rows: {
                    bid: boolean;
                    price: number;
                    cumulative: number;
                    quantity: number;
                }[] = [];
                let cumulative = 0;
                let missedBracket = 0;

                for (let i = 0; i < orders.length; i++) {
                    if (rows.length >= 8) {
                        break;
                    }
                    const order = orders[i];
                    // round to the nearest bracket below current price for bid and above for ask
                    const bracket = bid
                        ? Math.floor(order.price / decimalKeyMap[decimals]) * decimalKeyMap[decimals]
                        : Math.ceil(order.price / decimalKeyMap[decimals]) * decimalKeyMap[decimals];
                    let innerCumulative = 0;
                    for (let p = i; p < orders.length; p++) {
                        if ((bid && orders[p].price < bracket) || (!bid && orders[p].price > bracket)) {
                            // if we just exit because price we want to recheck this next loop so set it to p -1
                            i = p - 1;
                            if (p >= orders.length - 1) {
                                missedBracket = bid
                                    ? Math.floor(orders[p].price / decimalKeyMap[decimals]) * decimalKeyMap[decimals]
                                    : Math.ceil(orders[p].price / decimalKeyMap[decimals]) * decimalKeyMap[decimals];
                                // if its the end of the line then we want to set missed order
                                i = p;
                            }
                            break;
                        }
                        innerCumulative += orders[p].quantity;
                        if (p >= orders.length - 1) {
                            // weve reached the last order
                            i = p;
                            break;
                        }
                    }
                    cumulative += innerCumulative;
                    rows.push({
                        bid: bid,
                        price: bracket,
                        cumulative: cumulative,
                        quantity: innerCumulative,
                    });
                    if (missedBracket) {
                        // this will be the very last order
                        rows.push({
                            bid: bid,
                            price: missedBracket,
                            cumulative: cumulative + orders[i].quantity,
                            quantity: orders[i].quantity,
                        });
                    }
                }
                const maxCumulative = sumQuantities(rows);
                const withSetMax = rows.map((row) => (
                    <Order
                        key={`book-row-${row.price}`}
                        maxCumulative={maxCumulative}
                        bid={row.bid}
                        price={row.price}
                        cumulative={row.cumulative}
                        quantity={row.quantity}
                        onClick={(_e) => setOrderFromBook(row)}
                    />
                ));
                return !bid ? withSetMax.reverse() : withSetMax;
            },
            [decimals],
        );

        return (
            <div className={className}>
                <OrderBookContainer>
                    <OrderBookTitle>Order Book</OrderBookTitle>
                    <OrderBookToggle showOrderBook={showOrderBook} onClick={() => setShowOrderBook(!showOrderBook)} />
                    {showOrderBook ? (
                        askOrders?.length || bidOrders?.length ? (
                            <>
                                <PrecisionDropdown setDecimals={setDecimals} decimals={decimals} />
                                <BookRow className="header">
                                    <Item>Price</Item>
                                    <Item>Quantity</Item>
                                    <Item className="cumulative">Cumulative</Item>
                                </BookRow>
                                {renderOrders(false, askOrdersCopy)}
                                <MarketRow>
                                    <Item className="mr-auto">
                                        <TooltipSelector tooltip={{ key: 'best' }}>Best</TooltipSelector>
                                        <span
                                            className="ask px-1"
                                            onClick={(_e) =>
                                                setOrderFromBook({
                                                    quantity: askOrdersCopy[0]?.quantity ?? 0,
                                                    price: askOrdersCopy[0]?.price ?? 0,
                                                    bid: false,
                                                })
                                            }
                                        >
                                            {toApproxCurrency(askOrdersCopy[0]?.price)}
                                        </span>
                                        {` / `}
                                        <span
                                            className="bid px-1"
                                            onClick={(_e) =>
                                                setOrderFromBook({
                                                    quantity: bidOrdersCopy[0]?.quantity ?? 0,
                                                    price: bidOrdersCopy[0]?.price ?? 0,
                                                    bid: true,
                                                })
                                            }
                                        >
                                            {toApproxCurrency(bidOrdersCopy[0]?.price)}
                                        </span>
                                    </Item>
                                    <Item className="no-width">
                                        {`Last`}
                                        <span
                                            className={`${marketUp ? 'bid' : 'ask'} pl-1`}
                                            onClick={(_e) =>
                                                setOrderFromBook({
                                                    quantity: 0,
                                                    price: lastTradePrice.toNumber(),
                                                    bid: true,
                                                })
                                            }
                                        >
                                            {toApproxCurrency(lastTradePrice)}
                                        </span>
                                    </Item>
                                </MarketRow>
                                {renderOrders(true, bidOrdersCopy)}
                            </>
                        ) : (
                            <Icon component={TracerLoading} className="tracer-loading" />
                        )
                    ) : null}
                </OrderBookContainer>
                {showOverlay ? <FogOverlay buttonName="Show Order Book" onClick={() => setOverlay(false)} /> : null}
            </div>
        );
    },
)`
    position: relative;
    @media (max-height: 850px) {
        display: ${(props) => (props.displayBook ? 'block' : 'none')};
        overflow: auto;
    }
`;

export default OrderBook;

const OrderBookTitle = styled.div`
    font-size: var(--font-size-small-heading);
    font-weight: bold;
    letter-spacing: -0.4px;
    color: #ffffff;
    text-transform: capitalize;
    margin: 0 0.8rem 0.5rem;
`;

const StyledToggle = styled.img`
    height: 0.8rem;
    transition: all 400ms ease-in-out;
    display: inline;
    margin-top: -0.2rem;
    margin-left: 0.2rem;

    &.rotate {
        transform: rotate(180deg);
        margin-top: -4px;
    }
`;
interface OBTProps {
    className?: string;
    showOrderBook: boolean;
    onClick: () => void;
}
const OrderBookToggle = styled(({ className, showOrderBook, onClick }: OBTProps) => {
    return (
        <div className={className} onClick={onClick}>
            <StyledToggle className={showOrderBook ? 'rotate' : ''} src="/img/general/triangle_down_cropped.svg" />
        </div>
    );
})<OBTProps>`
    position: absolute;
    right: 1rem;
    top: 0.7rem;

    &:hover {
        cursor: pointer;
    }
`;

const Item = styled.div`
    width: 100%;
    white-space: nowrap;
    margin: 0 0.8rem;
    // border-radius: 2px;

    &.cumulative {
        text-align: right;
    }

    &.no-width {
        width: auto;
    }
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
    transition: 0.1s;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    &.header {
        margin-bottom: 0.4rem;
    }

    ${Item}.fill-bid {
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-image: linear-gradient(to left, #05cb3a66 100%, white 0%);
        background-size: 0;
    }

    ${Item}.fill-ask {
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-image: linear-gradient(to left, #f1502566 100%, white 0%);
        background-size: 0;
    }
`;

const MarketRow = styled(BookRow)`
    background: var(--color-background-secondary);
    padding: 0.5rem 0;
    &:hover {
        opacity: 1;
    }
    ${Item} > span {
        transition: 0.1s;
    }
    ${Item} > span:hover {
        opacity: 0.7;
        cursor: pointer;
    }
    @media (max-width: 1279px) {
        display: inline-block;
        ${Item}:first-child {
            margin-bottom: 0.2rem;
        }
    }
`;

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
    onClick: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
}

const Order: React.FC<BProps> = ({ className, cumulative, quantity, price, maxCumulative, bid, onClick }: BProps) => {
    return (
        <BookRow className={className} onClick={onClick}>
            <Item className={`${bid ? 'bid' : 'ask'} price`}>{toApproxCurrency(price)}</Item>
            <Item className={`quantity`}>{quantity.toFixed(2)}</Item>
            <Item
                className={`fill-${bid ? 'bid' : 'ask'} cumulative`}
                style={{
                    backgroundSize: getPercentage(cumulative, maxCumulative) + '% 100%',
                }}
            >
                {cumulative.toFixed(2)}
            </Item>
        </BookRow>
    );
};

const StyledTriangleDown = styled.img`
    height: 0.5em;
    transition: all 400ms ease-in-out;
    display: inline;
    margin-top: -0.2em;
    margin-left: 10%;

    &.rotate {
        transform: rotate(180deg);
        margin-top: -4px;
    }
`;

const PrecisionDropdownButton = styled(Button)`
    height: var(--height-extra-small-button);
    padding: 0;
    max-width: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

type PDProps = {
    setDecimals: (val: number) => void;
    decimals: number;
    className?: string;
};

export const PrecisionDropdown = styled(({ className, decimals, setDecimals }: PDProps) => {
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
                );
            })}
        </Menu>
    );
    const handleVisibleChange = (visible: boolean) => {
        setRotated(visible);
    };
    return (
        <Dropdown className={className} overlay={menu} placement="bottomCenter" onVisibleChange={handleVisibleChange}>
            <PrecisionDropdownButton>
                {decimalKeyMap[decimals]}
                <StyledTriangleDown className={rotated ? 'rotate' : ''} src="/img/general/triangle_down_cropped.svg" />
            </PrecisionDropdownButton>
        </Dropdown>
    );
})<PDProps>`
    position: absolute;
    right: 2.5rem;
    top: 0.7rem;

    &:hover {
        background: none;
        color: var(--color-primary);
    }
`;

const OrderBookContainer = styled.div`
    border-top: 1px solid var(--color-accent);
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0.6rem 0;
    @media (max-height: 850px) {
        ${OrderBookTitle}, ${OrderBookToggle}, ${PrecisionDropdown} {
            display: none;
        }
    }
`;
