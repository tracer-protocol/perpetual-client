import React, { useContext } from 'react';
import { OrderContext } from 'context';
import Tracer from '@libs/Tracer';
import styled from 'styled-components';
import { Box, Button } from '@components/General';
import { PlaceOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import Error from '@components/Trade/Error';
import { Exposure, Leverage } from './Inputs';

type SProps = {
    selected: number;
	setAdjustType: (index: number) => void;
    className?: string;
};

const AdjustTypeSelect: React.FC<SProps> = styled(({ selected, className, setAdjustType }: SProps) => {
    return (
        <SlideSelect
            className={className}
            onClick={(index, _e) => {
				setAdjustType(index)
            }}
            value={selected}
        >
            <Option>Adjust</Option>
            <Option>Close</Option>
        </SlideSelect>
    );
})`
    border-radius: 0;
    border-bottom: 1px solid #002886;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    height: 50px;

    > .bg-slider {
        background: #002886;
        border-radius: 0;
    }
`;

const SError = styled(Error)<{ account: string }>`
    position: relative;
    transform: translateY(-100%);
    display: ${(props) => (props.account === '' ? 'none' : 'block')};
    &.show {
        transform: translateY(0);
    }
`;

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export default styled(({ selectedTracer, className, account }: TIProps) => {
    // switching to Close Position changes their position to the opposite side through OrderContext
    const { order, orderDispatch } = useContext(OrderContext);
    return (
        <>
            <Box className={`${className} ${account === '' ? 'hide' : ''} `}>
                {/* Position select */}
                <AdjustTypeSelect 
					selected={order?.adjustType ?? 0}
					setAdjustType={(index) => {
                        orderDispatch
                            ? orderDispatch({ type: 'setAdjustType', value: index })
                            : console.error('No dispatch function set');
					}} 
				/>

                {order?.adjustType !== 0
                    ? 
                        <Exposure 
                            orderDispatch={orderDispatch}
                            selectedTracer={selectedTracer}
                            exposure={order?.exposure ?? NaN}
                        />
                    : <Leverage leverage={order?.leverage ?? 1} />
                }

                <PlaceOrderButton className="text-center">
                    <Button>{order?.adjustType === 0 ? 'Adjust Order' : 'Close Position'} </Button>
                </PlaceOrderButton>
            </Box>
            <SError error={order?.error ?? -1} account={account} />
        </>
    );
})`
    transition: opacity 0.3s 0.1s, height: 0.3s 0.1s, padding 0.1s;
    overflow: auto;
    position: relative;
    border-bottom: none;
    background: #00125D;
    display: block;
    padding: 0;
    height: 100%;
    &.hide {
        height: 0;
        padding: 0;
        opacity: 0;
        border: none;
    }
` as React.FC<TIProps>;
