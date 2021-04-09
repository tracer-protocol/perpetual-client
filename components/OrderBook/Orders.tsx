import React from 'react';

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
}

export const BidOrder: React.FC<BProps> = ({ cumulative, quantity, price, maxCumulative }: BProps) => {
    return (
        <tr className="bid cRow">
            <td>{quantity}</td>
            <td>{price}</td>
            <td
                className="fill-bid cCell"
                style={{ backgroundSize: getPercentage(cumulative, maxCumulative) + '% 100%' }}
            >
                {cumulative}
            </td>
        </tr>
    );
};

export const AskOrder: React.FC<BProps> = ({ cumulative, quantity, price, maxCumulative }: BProps) => {
    return (
        <tr className="ask cRow">
            <td>{quantity}</td>
            <td>{price}</td>
            <td
                className="fill-ask cCell"
                style={{ backgroundSize: getPercentage(cumulative, maxCumulative) + '% 100%' }}
            >
                {cumulative}
            </td>
        </tr>
    );
};
