import React, { useContext, useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import TracerModal from '@components/Modals';
import { OrderState, OrderTypeMapping, Errors } from '@context/OrderContext';
import { OrderContext, TracerContext } from 'context';
import { Children, UserBalance } from 'types';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

const TradeButton = styled.div`
    letter-spacing: -0.32px;
    color: #ffffff;
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
    const orderBase = order?.orderBase ?? 0;

    useEffect(() => {
        if (!!balances) {
            // Margin is greater than margin in account
            // balances?.quote < orderBase && balances?.quote >= 0 && orderBase > 0 ? setError(1, 1) : setError(0, 1);
        }
    }, [orderBase]);

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
    const { order } = useContext(OrderContext);
    const { orderBase, price, orderType } = order as OrderState;
    const { addToast } = useToasts();
    const [showOrder, setShowOrder] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOrder = async (_e: any) => {
        if (order?.error !== -1) {
            setLoading(true);
            placeOrder
                ? await placeOrder(order as OrderState)
                : console.error('Error placing order: Place order function is not defined');
            setLoading(false);
            setShowOrder(false);
        } else {
            addToast(`Invalid order: ${Errors[order?.error]?.message}`, {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    };

    const message = () => {
        if (orderType === 0) {
            return `Using $${orderBase} to place 0 orders at an average price of ${price}`;
        } else if (orderType === 1) {
            return `Using $${orderBase} to place a ${OrderTypeMapping[orderType]} order at $${price}`;
        }
    };

    if (order?.error === -1) {
        return (
            <>
                <TracerModal
                    loading={loading}
                    show={showOrder}
                    onClose={() => setShowOrder(false)}
                    title={'Order'}
                    subTitle={'Confirm your order'}
                >
                    <div className="p-6 flex-auto">
                        <div className="border-b-2 border-gray-100">
                            <h3 className="mt-5 text-left text-blue-100 text-lg">Orders</h3>
                            <h3>{message()}</h3>
                        </div>
                        <div className="flex mt-5">
                            <button className="button m-auto" onClick={handleOrder}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </TracerModal>
                <div className={`w-full ${className}`} onClick={() => setShowOrder(true)}>
                    {children}
                </div>
            </>
        );
    } else {
        return (
            <Tooltip title={Errors[order?.error ?? -1]?.message}>
                <div className={`button-disabled ${className}`}>{children}</div>
            </Tooltip>
        );
    }
};
