import React, { useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { OrderState } from '@context/OrderContext';
import { LIMIT, MARKET, SHORT, LONG } from '@libs/types/OrderTypes';
import { OrderContext, TracerContext, TransactionContext } from 'context';
import { Children } from 'libs/types';
import Tooltip from 'antd/lib/tooltip';
import { OMEContext } from '@context/OMEContext';
import { Button } from '@components/General';
import styled from 'styled-components';
import { OrderErrors } from '@components/General/Error';
import { defaults } from '@libs/Tracer';

const ParentDisable = styled(Button)`
    .button-disabled & {
        opacity: 0.5;
        cursor: not-allowed;
        background: none;
        color: var(--color-primary);

        &:hover {
            background: none;
            color: var(--color-primary);
        }
    }
`;
export const AdvancedOrderButton: React.FC = styled(({ className, children }) => (
    <div className={className}>
        <PlaceOrderButton>
            <ParentDisable className="m-auto primary" height="medium">
                {children}
            </ParentDisable>
        </PlaceOrderButton>
    </div>
))`
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
`;

type POBProps = {
    className?: string;
} & Children;

export const PlaceOrderButton: React.FC<POBProps> = ({ className, children }: POBProps) => {
    const { placeOrder } = useContext(TracerContext);
    const { omeDispatch = () => console.error('OME dispatch is undefined') } = useContext(OMEContext);
    const { order, orderDispatch = () => console.error('Order dispatch is undefined') } = useContext(OrderContext);
    const { handleAsync } = useContext(TransactionContext);
    const { addToast } = useToasts();

    const handleOrder = async (_e: any) => {
        if (order?.error === 'NO_ERROR') {
            if (placeOrder) {
                if (handleAsync) {
                    handleAsync(placeOrder, [order as OrderState], {
                        statusMessages: {
                            waiting: 'Please sign the transaction through your web3 provider',
                        },
                        onSuccess: () => {
                            omeDispatch({ type: 'refetchOrders' });
                            omeDispatch({ type: 'refetchUserOrders' });
                            orderDispatch({ type: 'setExposure', value: NaN });
                        },
                    });
                } else {
                    console.error('Error placing order: Handle transaction function is not defined');
                }
            } else {
                console.error('Error placing order: Place order function is not defined');
            }
        } else {
            if (order?.error) {
                addToast(['Transaction Failed', `Invalid order: ${OrderErrors[order.error]?.message}`], {
                    appearance: 'error',
                    autoDismiss: true,
                });
            } else {
                addToast(['Transaction Failed', 'Invalid order: An unhandled error occurred'], {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        }
    };

    // if there is NO_ERROR
    //  and
    //      exposure and price has been inputted for limit
    //      or exposure has been entered for market
    if (
        order?.error === 'NO_ERROR' &&
        ((order?.exposure && order?.price && order.orderType === LIMIT) ||
            (order?.exposure && order.orderType === MARKET))
    ) {
        return (
            <div className={`${className ?? ''}`} onClick={handleOrder}>
                {children}
            </div>
        );
    } else {
        return (
            <Tooltip title={OrderErrors[order?.error ?? -1]?.message}>
                <div className={`button-disabled ${className ?? ''}`}>{children}</div>
            </Tooltip>
        );
    }
};

export const CloseOrderButton: React.FC<POBProps> = ({ className }: POBProps) => {
    const { placeOrder, selectedTracer } = useContext(TracerContext);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const { omeState, omeDispatch = () => console.error('OME dispatch is undefined') } = useContext(OMEContext);
    const { order: orderState, orderDispatch = () => console.error('Order dispatch is undefined') } =
        useContext(OrderContext);
    const { handleAsync } = useContext(TransactionContext);

    const closePosition = async (_e: any) => {
        if (placeOrder) {
            if (handleAsync) {
                const position = balances.base.lt(0) ? LONG : SHORT;
                const order = {
                    exposureBN: balances.base.abs(),
                    price: (position === LONG ? omeState?.maxAndMins?.maxAsk : omeState?.maxAndMins?.minBid) ?? 0,
                    position: position,
                };

                handleAsync(placeOrder, [order as OrderState], {
                    statusMessages: {
                        waiting: 'Please sign the transaction through your web3 provider',
                    },
                    onSuccess: () => {
                        omeDispatch({ type: 'refetchOrders' });
                        omeDispatch({ type: 'refetchUserOrders' });
                        orderDispatch({ type: 'setExposure', value: NaN });
                        orderDispatch({ type: 'setLeverage', value: NaN });
                    },
                });
            } else {
                console.error('Error closing order: Handle transaction function is not defined');
            }
        } else {
            console.error('Error placing order: Place order function is not defined');
        }
    };

    if (balances.base.eq(0) || orderState?.error === 'NO_ORDERS') {
        return (
            <Tooltip title={OrderErrors[orderState?.error ?? -1]?.message}>
                <Button disabled={true}>Close Position</Button>
            </Tooltip>
        );
    } else {
        return (
            <Button className={`${className} primary`} onClick={closePosition}>
                Close Position
            </Button>
        );
    }
};
