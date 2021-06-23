import React, { useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { LIMIT, MARKET, OrderState } from '@context/OrderContext';
import { OrderContext, TracerContext, TransactionContext } from 'context';
import { Children } from 'types';
import Tooltip from 'antd/lib/tooltip';
import { OMEContext } from '@context/OMEContext';
import { Button } from '@components/General';
import styled from 'styled-components';
import { OrderErrors } from '@components/General/Error';

const ParentDisable = styled(Button)`
    .button-disabled & {
        cursor: not-allowed;
        opacity: 0.5;
        background: none;
        color: var(--color-primary);

        &:hover {
            color: var(--color-primary);
            background: none;
        }
    }
`;
export const AdvancedOrderButton: React.FC = styled(({ className, children }) => (
    <div className={className}>
        <PlaceOrderButton>
            <ParentDisable className="m-auto primary">{children}</ParentDisable>
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
    const { order } = useContext(OrderContext);
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
                        callback: () => {
                            omeDispatch({ type: 'refetchOrders' });
                            omeDispatch({ type: 'refetchUserOrders' });
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
                addToast(['Transaction Failed', `Invalid order: An unhandled error occured`], {
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
