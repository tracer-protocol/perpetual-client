import React, { useContext, useEffect, useReducer } from 'react';
import { FactoryContext } from './FactoryContext';
import { Children, Result, UserBalance } from 'libs/types';
import { createOrder } from '@libs/Ome';
import { Web3Context } from './Web3Context';
import { OrderState } from './OrderContext';
import Web3 from 'web3';
import { orderToOMEOrder, OrderData, signOrdersV4 } from '@tracer-protocol/tracer-utils';
import Tracer from '@libs/Tracer';
import { TransactionContext, Options } from './TransactionContext';
import { defaults } from '@libs/Tracer';
// @ts-ignore
import { Callback } from 'web3/types';
import { MatchedOrders } from '@tracer-protocol/contracts/types/TracerPerpetualSwaps';
import { bigNumberToWei } from '@libs/utils';
import { useWeb3 } from './Web3Context/Web3Context';
interface ContextProps {
    tracerId: string | undefined;
    deposit: (amount: number, options: Options) => void;
    withdraw: (amount: number, options: Options) => void;
    approve: (contract: string, options: Options) => void;
    setTracerId: (tracerId: string) => any;
    selectedTracer: Tracer | undefined;
    balances: UserBalance;
    placeOrder: (order: OrderState) => Promise<Result>;
}

export const TracerContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

type TracerState = {
    selectedTracer: Tracer | undefined;
    balances: UserBalance;
    userApproved: boolean;
};

type StoreProps = {
    tracer?: string;
} & Children;

/**
 * TracerStore which handles connection to the currently selectedTracer.
 * Useful on the trading interface but lacks the holistic overview that the FactoryContext has.
 * Used for calling functions on a specifically selectedTracer.
 * Leverages hooks to ensure the UI is responding correctly when updating TracerState.
 * Tracer state is updated by calling functions from the Tracer class.
 */
export const SelectedTracerStore: React.FC<StoreProps> = ({ tracer, children }: StoreProps) => {
    const { account, web3, config, network } = useWeb3();
    const { factoryState } = useContext(FactoryContext);
    const { handleTransaction, setPending, closePending } = useContext(TransactionContext);

    const initialState: TracerState = {
        selectedTracer: undefined,
        balances: defaults.balances,
        userApproved: false,
    };

    const reducer = (state: TracerState, action: Record<string, any>) => {
        switch (action.type) {
            case 'setSelectedTracer':
                return { ...state, selectedTracer: action.value };
            case 'setUserBalance':
                return { ...state, balance: action.value };
            case 'setUserApproved':
                return { ...state, userApproved: true };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [tracerState, tracerDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // for initialising the tracer store through props
        if (tracer && factoryState?.hasSetTracers) {
            const t = factoryState?.tracers[tracer];
            if (t) {
                tracerDispatch({ type: 'setSelectedTracer', value: t });
            } else {
                console.error(`Failed to set tracer with address ${tracer}`);
            }
        }
    }, [tracer, factoryState?.hasSetTracers]);

    useEffect(() => {
        // detecting when tracers changes so we can set a default tracer
        if (factoryState?.hasSetTracers) {
            const defaultTracer = Object.values(factoryState?.tracers)[0];
            if (defaultTracer) {
                tracerDispatch({ type: 'setSelectedTracer', value: defaultTracer });
                fetchUserData();
            } else {
                tracerDispatch({ type: 'setSelectedTracer', value: undefined });
                console.error(`Failed to set tracer with address ${tracer}`);
            }
            // for testing purposes this will not be done each time someone opens the app
            // createBook(defaultTracer);
        }
    }, [factoryState?.hasSetTracers]);

    const { selectedTracer, balances } = tracerState;

    const fetchUserData = async () => {
        if (factoryState?.hasSetTracers) {
            const userData = await selectedTracer?.updateUserBalance(account);
            await selectedTracer?.checkApproved(account);
            tracerDispatch({ type: 'setUserBalance', value: userData });
        }
    };

    const matchedOrders: Callback<MatchedOrders> = (err: Error, res: MatchedOrders) => {
        if (err) {
            console.error('Failed to listen on matched orders', err.message);
        } else if (
            account?.toLocaleLowerCase() === res.returnValues.long.toLowerCase() ||
            account?.toLocaleLowerCase() === res.returnValues.short.toLowerCase()
        ) {
            fetchUserData();
            closePending ? closePending() : console.error('Close pending is undefined');
        }
    };

    const placeOrder: (order: OrderState) => Promise<Result> = async (order) => {
        const { exposureBN, price, position } = order;
        const amount = bigNumberToWei(exposureBN) ?? 0;
        const now = Math.floor(Date.now() / 1000); // timestamp in seconds
        const fourDays = 345600; // four days in seconds
        const fiveMins = 5 * 60; // five minutes in seconds
        const makes: OrderData[] = [
            {
                amount: amount,
                price: Web3.utils.toWei(price.toString()),
                side: position ? 1 : 0, // position === SHORT === 1 then 1 else 0
                maker: account ?? '',
                expires: now + fourDays,
                market: selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer.address) : '',
                created: now - fiveMins, // avoid out of sync clocks breaking orders
            },
        ];
        try {
            const signedMakes = await signOrdersV4(web3, makes, config?.contracts.trader.address as string, network);
            const omeOrder = orderToOMEOrder(web3, await signedMakes[0]);
            console.info('Placing OME order', omeOrder);
            const res = await createOrder(selectedTracer?.address as string, omeOrder);
            if (res.message === 'PartialMatch' || res.message === 'FullMatch') {
                // if there is a partial or full match add a toaster
                setPending
                    ? setPending(res.message)
                    : console.error('Partial or full match but setPending function is not defined');
            } else if (res.message === 'Add') {
                return {
                    status: res.status,
                    message: `Successfully created order`,
                };
            }
            return {
                status: res.status,
                message: res.message,
            };
        } catch (err) {
            return { status: 'error', message: `Failed to place order ${err}` } as Result;
        }
    };

    const approve = async (contract: string, options: Options) => {
        const { onSuccess: onSuccess_ } = options ?? {};
        if (handleTransaction) {
            if (!contract) {
                console.error('Failed to approve: contract is undefined');
                return false;
            }
            const onSuccess = () => {
                selectedTracer?.setApproved(contract);
                fetchUserData();
                onSuccess_ ? onSuccess_() : null;
            };

            handleTransaction(selectedTracer.approve, [account, contract], {
                ...options,
                onSuccess,
                statusMessages: {
                    userConfirmed: 'Unlock USDC Submitted',
                    pending: 'Transaction to unlock USDC is pending',
                },
            });
        } else {
            console.error(`Failed to approve: handleTransaction is undefined `);
        }
    };

    const deposit = async (amount: number, options: Options) => {
        if (handleTransaction) {
            const { onSuccess: onSuccess_, onError: onError_ } = options ?? {};
            const approved = await selectedTracer?.checkAllowance(account, selectedTracer.address);
            if (approved === 0) {
                // not approved 
                // unlikely to get in here since there is an approve button
                console.error("Tracer is not approved for deposit")
                handleTransaction(selectedTracer.approve, [account, selectedTracer.address], {
                    onSuccess: () => {
                        selectedTracer?.setApproved(selectedTracer?.address);
                        fetchUserData();
                        onSuccess_ ? onSuccess_() : null;
                    }
                });
            }
            const onSuccess = async (res: Result) => {
                if (res.status !== 'error') {
                    const balance = await selectedTracer?.updateUserBalance(account);
                    tracerDispatch({ type: 'setUserBalance', value: balance });
                    onSuccess_ ? onSuccess_() : null;
                }
            };
            handleTransaction(selectedTracer?.deposit, [amount, account], {
                onSuccess,
                onError: onError_,
                statusMessages: {
                    pending: 'Transaction to deposit USDC is pending',
                },
            });
        } else {
            console.error(`Failed to deposit: handleTransaction is undefined `);
        }
    };
    const withdraw = async (amount: number, options: Options) => {
        if (handleTransaction) {
            const { onSuccess: onSuccess_, onError: onError_ } = options ?? {};
            const onSuccess = async (res: Result) => {
                if (res.status !== 'error') {
                    const balance = await selectedTracer?.updateUserBalance(account);
                    tracerDispatch({ type: 'setUserBalance', value: balance });
                    onSuccess_ ? onSuccess_() : null;
                }
            };
            handleTransaction(selectedTracer?.withdraw, [amount, account], {
                onSuccess,
                onError: onError_,
                statusMessages: {
                    pending: 'Transaction to withdraw USDC is pending',
                },
            });
        } else {
            console.error(`Failed to widthdraw handleTransaction is undefined `);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            fetchUserData();
        };
        fetch();
    }, [account]);

    useEffect(() => {
        if (selectedTracer) {
            fetchUserData();
            selectedTracer?.updateFeeRate();
            if (!selectedTracer?.hasSubscribed) {
                selectedTracer?.subscribeToMatchedOrders(matchedOrders);
            }
        }
    }, [selectedTracer]);

    const tracerId = selectedTracer?.marketId;

    return (
        <TracerContext.Provider
            value={{
                tracerId,
                deposit: (amount, options) => deposit(amount, options),
                withdraw: (amount, options) => withdraw(amount, options),
                approve: (contract, options) => approve(contract, options),
                setTracerId: (tracerId: string) =>
                    tracerDispatch({ type: 'setSelectedTracer', value: factoryState?.tracers?.[tracerId] }),
                selectedTracer,
                balances,
                placeOrder,
            }}
        >
            {children}
        </TracerContext.Provider>
    );
};
