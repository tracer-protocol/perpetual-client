import React, { useContext, useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import TracerModal from '@components/Modals';
import { OrderState, OrderTypeMapping, Errors } from '@context/OrderContext';
import { TracerContext, Web3Context, OrderContext, ErrorContext } from 'context';
import AlertInfo from '@components/Notifications/AlertInfo';
import { ConnectButton, MarginDeposit } from '@components/Buttons';
import { Children, UserBalance } from 'types';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

type OSProps = {
    setSummary: (bool: boolean) => void;
};

export const OrderSubmit: React.FC<OSProps> = ({ setSummary }: OSProps) => {
    const { account } = useContext(Web3Context);
    const { show, text, variant } = useContext(ErrorContext);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-1/2 h-24">
                <AlertInfo show={show} text={text} variant={variant} />
            </div>
            {account ? (
                <button className="mb-5 button" onClick={() => setSummary(true)}>
                    Order Summary
                </button>
            ) : (
                <ConnectButton />
            )}
        </div>
    );
};

// TODO change these requirements to not use balance.quote
// balance.quote is not the right value for this need to calculated available margin in the account
export const OrderSummaryButtons: React.FC<{ balances: UserBalance }> = ({ balances }) => {
    const { show, text, variant, setError } = useContext(ErrorContext);
    const { order } = useContext(OrderContext);
    const rMargin = order?.rMargin ?? 0;

    useEffect(() => {
        if (!!balances) {
            // Margin is greater than margin in account
            balances?.quote < rMargin && balances?.quote >= 0 && rMargin > 0 ? setError(1, 1) : setError(0, 1);
        }
    }, [rMargin]);

    return (
        <div>
            <div className="w-3/4 pt-5 m-auto h-24">
                <AlertInfo show={show} text={text} variant={variant} />
            </div>
            <div className="py-5 flex">
                {balances?.quote === 0 ? (
                    <div className="m-auto w-1/2">
                        <MarginDeposit />
                    </div>
                ) : (
                    ''
                )}
                <div className="m-auto w-1/2 flex justify-center">
                    <PlaceOrderButton />
                </div>
            </div>
        </div>
    );
};

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
    const rMargin = order?.rMargin ?? 0;

    useEffect(() => {
        if (!!balances) {
            // Margin is greater than margin in account
            // balances?.quote < rMargin && balances?.quote >= 0 && rMargin > 0 ? setError(1, 1) : setError(0, 1);
        }
    }, [rMargin]);

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
    const { takenOrders, order } = useContext(OrderContext);
    const { rMargin, price, orderType } = order as OrderState;
    const { addToast } = useToasts();
    const [showOrder, setShowOrder] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOrder = async (_e: any) => {
        if (order?.error !== -1) {
            setLoading(true);
            placeOrder
                ? await placeOrder(order as OrderState, takenOrders ?? [])
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
            return `Using $${rMargin} to place ${takenOrders?.length} orders at an average price of ${price}`;
        } else if (orderType === 1) {
            return `Using $${rMargin} to place a ${OrderTypeMapping[orderType]} order at $${price}`;
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
