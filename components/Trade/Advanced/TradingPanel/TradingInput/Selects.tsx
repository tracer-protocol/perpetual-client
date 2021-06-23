import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { OrderContext } from 'context';

type SProps = {
    selected: number;
    className?: string;
};

const SSlideSelect = styled(SlideSelect)`
    height: 32px;
    width: 70%;
`;

export const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                // when we go back to market order we need to ensure the price is locked
                if (orderDispatch) {
                    orderDispatch({ type: 'setPosition', value: index });
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>Long</Option>
            <Option>Short</Option>
        </SSlideSelect>
    );
};

export const OrderTypeSelect: React.FC<SProps> = styled(({ selected, className }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SlideSelect
            className={className}
            onClick={(index, _e) => {
                if (orderDispatch) {
                    orderDispatch({ type: 'setOrderType', value: index });
                    if (index === 0) {
                        orderDispatch({ type: 'setLock', value: true });
                    }
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>Limit</Option>
            <Option>Market</Option>
        </SlideSelect>
    );
})`
    border-radius: 0;
    border-bottom: 1px solid var(--color-accent);
    border-top: 0;
    border-right: 0;
    border-left: 0;
    height: var(--height-small-container);

    > .bg-slider {
        background: var(--color-accent);
        border-radius: 0;
    }
`;
