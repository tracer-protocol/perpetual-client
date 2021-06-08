import React, { createContext } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from 'types';
import PromiEvent from 'web3/promiEvent';
// @ts-ignore
import { TransactionReceipt } from 'web3/types';

type Options = {
    callback?: (res: Result) => any; // eslint-disable-line
    statusMessages?: {
        waiting?: string;
        error?: string;
        success?: string;
        pending?: string;
    };
};
type HandleTransactionType =
    | ((
          callMethod: (...args: any) => PromiEvent<TransactionReceipt>,
          params: any[], // eslint-disable-line
          options?: Options,
      ) => void)
    | undefined;

type HandleAsyncType =
    | ((
          callMethod: (...args: any) => Promise<Result>,
          params: any[], // eslint-disable-line
          options?: Options,
      ) => void)
    | undefined;

export const TransactionContext = createContext<{
    handleTransaction: HandleTransactionType;
    handleAsync: HandleAsyncType;
}>({
    handleTransaction: undefined,
    handleAsync: undefined,
});

// type Status = 'INITIALIZED' | 'PROCESSING' | 'ERROR' | 'SUCCESS'

// TODO store a list of transactions with a transaction state so the user can view all pending transactions
// The list can be populate when the user visits the page
export const TransactionStore: React.FC = ({ children }: Children) => {
    const { addToast, updateToast } = useToasts();

    /** Specifically handles transactions */
    const handleTransaction: HandleTransactionType = async (callMethod, params, options) => {
        const { statusMessages, callback } = options ?? {};
        // actually returns a string error in the library
        const toastId = addToast(
            ['Pending Transaction', statusMessages?.waiting ?? 'Approve transaction with provider'],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );
        const res = callMethod(...params);
        res.on('transactionHash', (hash) => {
            updateToast(toastId as unknown as string, {
                content: ['Example Title', statusMessages?.pending ?? `Waiting for transaction ${hash}`],
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            });
        })
            .on('receipt', (receipt) => {
                updateToast(toastId as unknown as string, {
                    content: [
                        'Transaction Successful',
                        statusMessages?.success ?? `Transaction successful: ${receipt.transactionHash}`,
                    ],
                    appearance: 'success',
                    autoDismiss: true,
                });
            })
            .on('error', (error) => {
                updateToast(toastId as unknown as string, {
                    // confirmed this is a string
                    content: [
                        'Transaction Cancelled',
                        statusMessages?.error ?? `Transaction cancelled: ${error.message}`,
                    ],
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
        callback ? callback(await res) : null;
    };

    /** Very similiar function to above but handles regular async functions, mainly signing */
    const handleAsync: HandleAsyncType = async (callMethod, params, options) => {
        const { statusMessages, callback } = options ?? {};
        // actually returns a string error in the library
        const toastId = addToast(
            ['Pending Transaction', statusMessages?.waiting ?? 'Approve transaction with provider'],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );

        const res = callMethod(...params);
        Promise.resolve(res).then((res) => {
            if (res.status === 'error') {
                updateToast(toastId as unknown as string, {
                    // confirmed this is a string
                    content: statusMessages?.error ?? `Transaction cancelled. ${res.message}`,
                    appearance: 'error',
                    autoDismiss: true,
                });
            } else {
                updateToast(toastId as unknown as string, {
                    content: statusMessages?.success ?? `${res.message}`,
                    appearance: 'success',
                    autoDismiss: true,
                });
            }
            callback ? callback(res) : null;
        });
    };

    return (
        <TransactionContext.Provider
            value={{
                handleTransaction,
                handleAsync,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
