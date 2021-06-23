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
        return (
            <tr className={className}>
                <td className={`${bid ? 'bid' : 'ask'}`}>{toApproxCurrency(price, 3)}</td>
                <td>{quantity.toFixed(3)}</td>
                <td
                    className={`fill-${bid ? 'bid' : 'ask'}`}
                    style={{ backgroundSize: getPercentage(cumulative, maxCumulative) + '% 100%' }}
                >
                    {cumulative.toFixed(3)}
                </td>
            </tr>
        );
    },
)`
    position: relative;
    border-bottom: 2px solid var(--color-background);
    text-align: left;
    font-size: var(--font-size-small);
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
