import React from 'react';

interface IProps {
    rate: number; // 0 <= rate <= 1
}

// TODO update this to fetch funding rate not feeRate
const FundingRateGraphic: React.FC<IProps> = ({ rate }: IProps) => {
    const fundingRate = rate;
    const green = Math.abs((-1 - fundingRate) * 5);
    const red = (1 - fundingRate) * 5;

    function loop(n: number, char: string) {
        const array = [];
        for (let i = 0; i < n; i++) {
            array.push(
                <span key={`fundingRate-${i}`} className={char === '>' ? 'green' : 'red'}>
                    {char}
                </span>,
            );
        }
        return array;
    }
    return (
        <div className="flex">
            {loop(green, '>')}
            <span className={fundingRate >= 0.5 ? 'green' : 'red'}>{'|'}</span>
            {loop(red, '<')}
            <span className={`${fundingRate >= 0.5 ? 'green' : 'red'} ml-1`}>{`${(fundingRate * 100).toFixed(2)}%`}</span>
        </div>
    );
};

export default FundingRateGraphic;
