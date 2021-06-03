import React, { createContext } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from 'types';

type HandleTransactionType =
    | ((
          callMethod: (...args: any) => Result | Promise<Result>,
          params: any[], // eslint-disable-line
          options?: {
              callback?: (res: Result) => any; // eslint-disable-line
              statusMessages?: {
                  waiting?: string;
                  error?: string;
                  success?: string;
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
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
