import React, { useContext, useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import TracerModal from '@components/Modals';
import { OrderState, OrderTypeMapping } from '@context/OrderContext';
import { TracerContext, Web3Context, OrderContext, ErrorContext } from 'context';
import { signOrders, orderToOMEOrder, OrderData } from '@tracer-protocol/tracer-utils';
import AlertInfo from '@components/Notifications/AlertInfo';
import { ConnectButton, MarginDeposit } from '@components/Buttons';
import { createOrder } from '@libs/Ome';
import { TracerInfo } from 'types';

type POBProps = {
    balance: number; // users wallets margin balance
};

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

// TODO change these requirements to not use balance.margin
// balance.margin is not the right value for this need to calculated available margin in the account
export const OrderSummaryButtons: React.FC = () => {
    const { tracerInfo } = useContext(TracerContext);
    const { balance } = tracerInfo as TracerInfo;
    const { show, text, variant, setError } = useContext(ErrorContext);
    const { order } = useContext(OrderContext);
    const rMargin = order?.rMargin ?? 0;

    useEffect(() => {
        if (!!balance) {
            // Margin is greater than margin in account
            balance.margin < rMargin && balance.margin >= 0 && rMargin > 0 ? setError(1, 1) : setError(0, 1);
        }
    }, [rMargin]);

    return (
        <div>
            <div className="w-3/4 pt-5 m-auto h-24">
                <AlertInfo show={show} text={text} variant={variant} />
            </div>
            <div className="py-5 flex">
                {balance?.margin === 0 ? (
                    <div className="m-auto w-1/2">
                        <MarginDeposit />
                    </div>
                ) : (
                    ''
                )}
                <div className="m-auto w-1/2 flex justify-center">
                    <PlaceOrderButton balance={balance?.margin ?? 0} />
                </div>
            </div>
        </div>
    );
};

export const AdvancedOrderButton: React.FC = () => {
    const { tracerInfo } = useContext(TracerContext);
    const { balance } = tracerInfo as TracerInfo;
    const { setError } = useContext(ErrorContext);
    const { order } = useContext(OrderContext);
    const rMargin = order?.rMargin ?? 0;

    useEffect(() => {
        if (!!balance) {
            // Margin is greater than margin in account
            balance.margin < rMargin && balance.margin >= 0 && rMargin > 0 ? setError(1, 1) : setError(0, 1);
        }
    }, [rMargin]);

    return (
        <div className="w-full flex">
            <div className="m-auto w-3/4 flex justify-center">
                <PlaceOrderButton balance={balance?.margin ?? 0} />
            </div>
        </div>
    );
};

export const PlaceOrderButton: React.FC<POBProps> = ({ balance }: POBProps) => {
    const { account, web3, config } = useContext(Web3Context);
    const { addToast } = useToasts();
    const { selectedTracer, tracerInfo, takeOrders, makeOrder } = useContext(TracerContext);
    const { takenOrders, order } = useContext(OrderContext);
    const { priceMultiplier } = tracerInfo as TracerInfo;
    const { rMargin, price, orderType, position, matchingEngine } = order as OrderState;

    const [validOrder, setValidOrder] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const [loading, setLoading] = useState(false);

    const placeOrder = async (_e: any) => {
        if (validOrder) {
            setLoading(true);
            let res;
            if (matchingEngine === 1) {
                // OME order
                const parsedPrice = price * priceMultiplier;
                const amount = web3?.utils.toWei(rMargin.toString()) ?? 0;
                const expiration = new Date().getTime() + 604800;
                const makes: OrderData[] = [
                    {
                        amount: amount,
                        price: parsedPrice.toString(),
                        side: position === 0,
                        user: account ?? '',
                        expiration: expiration,
                        targetTracer:
                            selectedTracer?.address && web3 ? web3.utils.toChecksumAddress(selectedTracer.address) : '',
                        nonce: 5101,
                    },
                ];
                const signedMakes = await signOrders(web3, makes, config?.contracts.trader.address as string);
                const order = orderToOMEOrder(web3, await signedMakes[0]);
                await createOrder(selectedTracer?.address as string, order);
                res = { status: 'success' }; // TODO add error check
            } else if (matchingEngine === 0) {
                // On-chain
                if (orderType === 0) {
                    res = takeOrders
                        ? await takeOrders(takenOrders ?? [])
                        : {
                              status: 'error',
                              message: 'Take order function is undefined',
                          };
                } else if (orderType === 1) {
                    res = makeOrder
                        ? await makeOrder(rMargin, Math.round(price * 1000000), position === 0)
                        : {
                              status: 'error',
                              message: 'Make order function is undefined',
                          };
                }
            }
            if (res?.status === 'error') {
                addToast(`Transaction cancelled. ${res?.error}`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
            setShowOrder(false);
        } else {
            addToast('Invalid order', {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    };

    useEffect(() => {
        // TODO calc what a valid order is
        if (balance > 0 && balance >= rMargin && takenOrders?.length) {
            setValidOrder(true);
        } else {
            setValidOrder(false);
        }
    }, [rMargin, balance, takenOrders]);

    const message = () => {
        if (orderType === 0) {
            return `Using $${rMargin} to place ${takenOrders?.length} orders at an average price of ${price}`;
        } else if (orderType === 1) {
            return `Using $${rMargin} to place a ${OrderTypeMapping[orderType]} order at $${price}`;
        }
    };

    if (validOrder) {
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
                            <button className="button m-auto" onClick={placeOrder}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </TracerModal>
                <button className="button" onClick={() => setShowOrder(true)}>
                    Place Order
                </button>
            </>
        );
    } else {
        return <button className="button-disabled">Place Order</button>;
    }
};
