import { toApproxCurrency } from 'libs/utils';
import React from 'react';
import styled from 'styled-components';

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

export const Order: React.FC<BProps> = styled(
    ({ className, cumulative, quantity, price, maxCumulative, bid }: BProps) => {
        console.log(price, "Price")
        return (
            <tr className={className}>
                <td className={`${bid ? 'bid' : 'ask'}`}>{toApproxCurrency(price)}</td>
                <td>{quantity}</td>
                <td
                    className={`fill-${bid ? 'bid' : 'ask'}`}
                    style={{ backgroundSize: getPercentage(cumulative, maxCumulative) + '% 100%' }}
                >
                    {cumulative}
                </td>
            </tr>
        );
    },
)`
    position: relative;
    border-bottom: 2px solid #03065e;
    text-align: left;
    font-size: 16px;
    letter-spacing: -0.32px;

    .fill-bid {
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-image: linear-gradient(to left, #00ff0866 100%, white 0%);
        background-size: 0%;
    }

    .fill-ask {
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-image: linear-gradient(to left, #f1502566 100%, white 0%);
        background-size: 0%;
    }
`;
