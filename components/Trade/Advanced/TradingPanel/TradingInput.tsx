import React, { useContext } from 'react';
import { OrderContext } from 'context';
import Tracer, { defaults } from '@libs/Tracer';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { Box } from '@components/General';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { Inputs as InputSelects } from './Inputs';
import PostTradeDetails from './PostTradeDetails';
import Error from '@components/Trade/Error';

type SProps = {
    selected: number;
};

const SSlideSelect = styled(SlideSelect)`
    height: 40px;
`;

const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
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
            <Option>SHORT</Option>
            <Option>LONG</Option>
        </SSlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
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
            <Option>MARKET</Option>
            <Option>LIMIT</Option>
        </SSlideSelect>
    );
};

type LProps = {
    leverage: number;
    className?: string;
};

const Leverage: React.FC<LProps> = styled(({ leverage, className }: LProps) => {
    return (
        <div className={`${className} m-3`}>
            <a className="label">Leverage</a>
            <div className="w-3/4 px-4 pb-4">
                <DefaultSlider leverage={leverage} />
            </div>
        </div>
    );
})`
    display: flex;

    > .label {
        margin: 5px auto 35px 0;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
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
    const { order } = useContext(OrderContext);
    return (
        <>
            <Box className={`${className} ${account === '' ? 'hide' : ''} `}>
                <div className="body text-xs">
                    {/* Position select */}
                    <div className="py-2">
                        <OrderTypeSelect selected={order?.orderType ?? 0} />
                    </div>

                    {/* Position select */}
                    <div className="py-2">
                        <PositionSelect selected={order?.position ?? 0} />
                    </div>

                    {/* Quantity and Price Inputs */}
                    <InputSelects amount={order?.amountToPay} price={order?.price} selectedTracer={selectedTracer} />

                    {/* Dont display these if it is a limit order*/}
                    {order?.orderType !== 1 ? (
                        <>
                            {/* Leverage select */}
                            <Leverage leverage={order?.leverage ?? 1} />
                        </>
                    ) : (
                        <></>
                    )}

                    <PostTradeDetails
                        fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                        balances={selectedTracer?.getBalance() ?? defaults.balances}
                        exposure={order?.amountToBuy ? new BigNumber(order.amountToBuy) : defaults.amountToBuy}
                        position={order?.position ?? 0}
                        maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                    />

                    {/* Place Order */}
                    <div className="py-1">
                        <AdvancedOrderButton />
                    </div>
                </div>
            </Box>
            <SError error={order?.error ?? -1} account={account} />
        </>
    );
})`
    transition: opacity 0.3s 0.1s, height: 0.3s 0.1s, padding 0.1s;
    overflow: scroll;
    position: relative;
    border-bottom: none;
    height: 100%;
    &.hide {
        height: 0;
        padding: 0;
        opacity: 0;
        border: none;
    }
` as React.FC<TIProps>;
