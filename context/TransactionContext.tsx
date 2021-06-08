import React, { createContext } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from 'types';
import PromiEvent from 'web3/promiEvent';
// @ts-ignore
import { TransactionReceipt } from 'web3/types';

type HandleTransactionType =
    | ((
          callMethod: (...args: any) => PromiEvent<TransactionReceipt>,
          params: any[], // eslint-disable-line
          options?: {
              callback?: (res: Result) => any; // eslint-disable-line
              statusMessages?: {
                  waiting?: string;
                  error?: string;
                  success?: string;
                  pending?: string;
              };
          },
      ) => void)
    | undefined;

export const TransactionContext = createContext<{ handleTransaction: HandleTransactionType }>({
    handleTransaction: undefined,
});

// type Status = 'INITIALIZED' | 'PROCESSING' | 'ERROR' | 'SUCCESS'

// TODO store a list of transactions with a transaction state so the user can view all pending transactions
// The list can be populate when the user visits the page
export const TransactionStore: React.FC = ({ children }: Children) => {
    const { addToast, updateToast } = useToasts();

    const handleTransaction: HandleTransactionType = async (callMethod, params, options) => {
        const { statusMessages, callback } = options ?? {};
        // actually returns a string error in the library
        const toastId = addToast(statusMessages?.waiting ?? 'Approve transaction with provider', {
            appearance: 'loading' as AppearanceTypes,
            autoDismiss: false,
        });

        const res = callMethod(...params);
        res.on('transactionHash', (hash) => {
            updateToast(toastId as unknown as string, {
                content: statusMessages?.pending ?? `Waiting for transaction ${hash}`,
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            });
        })
            .on('receipt', (receipt) => {
                updateToast(toastId as unknown as string, {
                    content: statusMessages?.success ?? `Transaction successful: ${receipt.transactionHash}`,
                    appearance: 'success',
                    autoDismiss: true,
                });
            })
            .on('error', (error) => {
                updateToast(toastId as unknown as string, {
                    // confirmed this is a string
                    content: statusMessages?.error ?? `Transaction cancelled: ${error.message}`,
                    appearance: 'error',
                    autoDismiss: true,
                });
            });
        callback ? callback(await res) : null;
    };

    return (
        <TransactionContext.Provider
            value={{
                handleTransaction,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
