import React from 'react';
import styled from 'styled-components';

interface MCProps {
    className?: string;
    amount: number;
    size?: 'sm' | 'lg';
    before?: boolean; // boolean to determin which side the arrow goes on
}

const MarketChange: React.FC<MCProps> = styled(
    ({ className, amount, size, before }: MCProps) => (
        <div className={className}>
            {before ? (
                <>
                    <div
                        className={`${
                            amount >= 0 ? 'arrow-up' : 'arrow-down'
                        } ${size} ${before ? 'before' : ''}`}
                    />
                    <p className={amount >= 0 ? 'up' : 'down'}>0%</p>
                </>
            ) : (
                <>
                    <p className={amount >= 0 ? 'up' : 'down'}>0%</p>
                    <div
                        className={`${
                            amount >= 0 ? 'arrow-up' : 'arrow-down'
                        } ${size}`}
                    />
                </>
            )}
        </div>
    ),
)`
    display: flex;
    .up {
        color: #21dd53;
    }
    .down {
        color: #f15025;
    }

    .arrow-up {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 8px solid #21dd53;
    }
    .arrow-up,
    arrow-down {
        margin: auto 0;
        margin-left: 5px;
        height: 0;
        width: 0;
    }
    .arrow-up.before,
    arrow-down.before {
        margin: auto 0;
        margin-right: 5px;
        height: 0;
        width: 0;
    }
    .arrow-up.lg {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid #21dd53;
    }
    .arrow-down.lg {
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid #f15025;
    }
    .arrow-down {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 8px solid #f15025;
    }
`;

MarketChange.defaultProps = {
    amount: 0,
    size: 'sm',
    before: true,
};

export default MarketChange;
