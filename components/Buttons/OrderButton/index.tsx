import React, { useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { OrderState, Errors } from '@context/OrderContext';
import { OrderContext, TracerContext, TransactionContext } from 'context';
import { Children, UserBalance } from 'types';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';
import { OMEContext } from '@context/OMEContext';

const TradeButton = styled.div`
    letter-spacing: -0.32px;
    width: 100%;
    font-size: 16px;
    text-align: center;
    border: 1px solid #3da8f5;
    border-radius: 10px;
    padding: 10px 0;
    background: #03065e;
    color: #3da8f5;
    transition: 0.3s;

    &:hover {
        background: #3da8f5;
        color: #fff;
        cursor: pointer;
    }

    .button-disabled &:hover {
        cursor: not-allowed;
    }
`;

export const AdvancedOrderButton: React.FC<{
    balances: UserBalance | undefined;
}> = ({ balances }: { balances: UserBalance | undefined }) => {
    // const { setError } = useContext(ErrorContext);
    const { order } = useContext(OrderContext);
    const amountToPay = order?.amountToPay ?? 0;

    useEffect(() => {
        if (!!balances) {
            // Margin is greater than margin in account
            // balances?.quote < amountToPay && balances?.quote >= 0 && amountToPay > 0 ? setError(1, 1) : setError(0, 1);
        }
    }, [amountToPay]);

    return (
        <div className="w-full flex">
            <PlaceOrderButton>
                <TradeButton>Place Trade</TradeButton>
            </PlaceOrderButton>
        </div>
    );
};

type POBProps = {
    className?: string;
} & Children;

export const PlaceOrderButton: React.FC<POBProps> = ({ className, children }: POBProps) => {
    const { placeOrder } = useContext(TracerContext);
    const { omeDispatch = () => console.error('OME dispatch is undefined') } = useContext(OMEContext);
    const { order } = useContext(OrderContext);
    const { handleTransaction } = useContext(TransactionContext);
    const { addToast } = useToasts();

    const handleOrder = async (_e: any) => {
        if (order?.error === -1) {
            if (placeOrder) {
                if (handleTransaction) {
                    handleTransaction(placeOrder, [order as OrderState], {
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
                addToast(`Invalid order: ${Errors[order.error]?.message}`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            } else {
                addToast(`Invalid order: An unhandled error occured`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        }
    };

    if (order?.error === -1) {
        return (
            <div className={`w-full ${className}`} onClick={handleOrder}>
                {children}
            </div>
        );
    } else {
        return (
            <Tooltip title={Errors[order?.error ?? -1]?.message}>
                <div className={`button-disabled ${className}`}>{children}</div>
            </Tooltip>
        );
    }
};
