import React, { useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { OrderState, Errors } from '@context/OrderContext';
import { OrderContext, TracerContext, TransactionContext } from 'context';
import { Children } from 'types';
import Tooltip from 'antd/lib/tooltip';
import { OMEContext } from '@context/OMEContext';
import { Button } from '@components/General';
import styled from 'styled-components';

const ParentDisable = styled(Button)`
    .button-disabled & {
        cursor: not-allowed;
    }
`;
export const AdvancedOrderButton: React.FC = () => (
    <div className="w-full flex text-center">
        <PlaceOrderButton>
            <ParentDisable className="m-auto primary">Place Trade</ParentDisable>
        </PlaceOrderButton>
    </div>
);

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
        if (order?.error === -1) {
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
                addToast(['Transaction Failed', `Invalid order: ${Errors[order.error]?.message}`], {
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

    if (order?.error === -1) {
        return (
            <div className={`w-full ${className ?? ''}`} onClick={handleOrder}>
                {children}
            </div>
        );
    } else {
        return (
            <Tooltip title={Errors[order?.error ?? -1]?.message}>
                <div className={`button-disabled ${className ?? ''}`}>{children}</div>
            </Tooltip>
        );
    }
};
