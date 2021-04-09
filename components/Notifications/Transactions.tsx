import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { Transaction } from '@lions-mane/web3-redux';
import { Notification, NotificationsContainer } from './Notification';
import { Web3Context } from '@components/context';

const Wrapper: React.FC<{ id: string; onDismiss: (id: string) => void }> = ({ id, onDismiss }) => {
    const [details, setDetails] = useState<{
        text: string;
        appearance: 'loading' | 'success';
        autoDismiss?: boolean;
    }>({
        text: 'Processing transaction',
        appearance: 'loading',
    });
    const transaction = useSelector((state) => Transaction.selectSingle(state, id));
    const receipt = transaction?.receipt;

    useEffect(() => {
        if (receipt?.blockNumber) {
            setDetails({
                text: `Transaction successful ${transaction?.hash}`,
                appearance: 'success',
                autoDismiss: true,
            });
        }
    }, [transaction?.receipt]);
    
    return (
        <Notification
            {...transaction}
            key={`transaction-${transaction?.id}`}
            onDismiss={() => onDismiss(id)}
            appearance={details.appearance}
            autoDismiss={details.autoDismiss}
            autoDismissTimeout={5000}
        >
            {details.text}
        </Notification>
    );
};

export default function Transactions() {
    const { account } = useContext(Web3Context);
    // TODO just change to BigInt
    const transactions: Transaction.Transaction[] = useSelector(Transaction.selectMany) as unknown as Transaction.Transaction[]

    const initialState: Record<string, any> = {};

    const reducer = (state: any, action: any) => {
        switch (action.type) {
            case 'add':
                return {
                    [action.transaction.id]: {
                        ...[action.transaction],
                    },
                    ...state,
                };
            case 'update':
                return {
                    ...state,
                    [action.id]: {
                        ...[action.id],
                        status: action.status,
                    },
                };
            case 'remove':
                const { [action.id]: _, ...newState } = state;
                return {
                    ...newState,
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        if (transactions?.length) {
            const transaction = transactions.pop();
            if (!transaction) return;
            if (!state[transaction?.id ?? 0] && transaction?.from === account) {
                dispatch({ type: 'add', transaction });
            }
        }
    }, [transactions]);

    return (
        <NotificationsContainer>
            {Object.keys(state).map((id) => {
                return (
                    <Wrapper
                        id={id}
                        onDismiss={() => {
                            console.info('Removing transaction hash', id);
                            dispatch({ type: 'remove', id: id });
                        }}
                    />
                );
            })}
        </NotificationsContainer>
    );
}
