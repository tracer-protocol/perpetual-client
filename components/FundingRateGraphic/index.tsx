import React from 'react';

interface IProps {
    rate: number;
}

const FundingRateGraphic: React.FC<IProps> = ({ rate }: IProps) => {
    const fundingRate = rate;
    const green = Math.abs((-1 - fundingRate) * 10);
    const red = (1 - fundingRate) * 10;

    function loop(n: number, char: string) {
        const array = [];
        for (let i = 0; i < n; i++) {
            array.push(
                <span key={`fundingRate-${i}`} className={char === '>' ? 'text-green-900' : 'text-red-900'}>
                    {char}
                </span>,
            );
        }
        return array;
    }
    return (
        <React.Fragment>
            {loop(green, '>')}
            <span>{'|'}</span>
            {loop(red, '<')}
        </React.Fragment>
    );
};

export default FundingRateGraphic;
