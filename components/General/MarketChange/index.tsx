import React from 'react';
import styled from 'styled-components';

interface MCProps {
    className?: string;
    amount: number;
}

const MarketChange: React.FC<MCProps> = styled(({ className, amount }: MCProps) => (
    <div className={className}>
        <div className={amount >= 0 ? 'up' : 'down'}>{amount}%</div>
        <div className={`${amount >= 0 ? 'arrow-up' : 'arrow-down'}`} />
    </div>
))`
    display: flex;
    .up {
        color: #21dd53;
    }
    .down {
        color: #f15025;
    }
    .arrow-up,
    .arrow-down {
        margin: auto 0 auto 5px;
        height: 0;
        width: 0;
    }
    .arrow-up.before,
    .arrow-down.before {
        margin: auto 5px auto 0;
        height: 0;
        width: 0;
    }
    .arrow-up {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid #21dd53;
    }
    .arrow-down {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid #f15025;
    }
`;

export default MarketChange;
