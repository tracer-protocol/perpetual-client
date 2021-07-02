import React, { useContext, useCallback, useReducer, useMemo } from 'react';
import styled from 'styled-components';
import { NumberSelect, Section } from '@components/General';
import { UserBalance } from 'types';
import ErrorComponent from '@components/General/Error';
import TracerModal from '@components/General/TracerModal';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { Button, HiddenExpand, Previous } from '@components/General';
import { TracerContext } from 'context';
import { BigNumber } from 'bignumber.js';
import {
    calcTotalMargin,
    calcMinimumMargin,
    calcBuyingPower,
    calcAvailableMarginPercent,
} from '@tracer-protocol/tracer-utils';
import { toApproxCurrency } from '@libs/utils';
import { defaults } from '@libs/Tracer';

const SNumberSelect = styled(NumberSelect)`
    margin-top: 1rem;
    .balance {
        color: var(--color-secondary);
    }
    > .balance > .max {
        margin-left: 1rem;
    }
`;

const SHiddenExpand = styled(HiddenExpand)`
    margin-left: 0;
    background: var(--color-accent);
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const ModalButton = styled(Button)`
    width: 80%;
    margin: auto;
    height: 40px;
    border: 1px solid #ffffff;
    color: var(--color-text);

    &:disabled {
        &:hover {
            background: none;
        }
    }
`;

const SSlideSelect = styled(SlideSelect)`
    max-width: 250px;
    margin-left: 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const ApproveButton = styled(Button)`
    width: 80%;
    margin: 1rem auto;
    height: 40px;
    border: 1px solid #ffffff;
    color: var(--color-text);
`;

type AMProps = {
    className?: string;
    close: () => any;
    isDeposit: boolean;
    setDeposit: React.Dispatch<React.SetStateAction<boolean>>;
    display: boolean;
    unit: string;
    balances: UserBalance;
    fairPrice: BigNumber;
    maxLeverage: BigNumber;
};

type ModalState = {
    amount: number;
    loading: boolean;
    title: string;
    subTitle: string;
};
type ModalAction =
    | { type: 'setAmount'; amount: number }
    | { type: 'setTitles'; title: string; subTitle: string }
    | { type: 'setLoading'; loading: boolean };

const initialState: ModalState = {
    amount: NaN,
    loading: false,
    title: 'Deposit Margin',
    subTitle: '',
};

const reducer = (state: ModalState, action: ModalAction) => {
    switch (action.type) {
        case 'setAmount': {
            return {
                ...state,
                amount: action.amount,
            };
        }
        case 'setTitles': {
            return {
                ...state,
                title: action.title,
                subTitle: action.subTitle,
            };
        }
        case 'setLoading': {
            return {
                ...state,
                loading: action.loading,
            };
        }
        default:
            throw new Error('Unexpected action');
    }
};

export default styled(
    ({ className, close, isDeposit, unit, balances, fairPrice, maxLeverage, display, setDeposit }: AMProps) => {
        const {
            deposit = () => console.error('Deposit is not defined'),
            withdraw = () => console.error('Withdraw is not defined'),
            approve = () => console.error('Approve is not defined'),
            selectedTracer,
        } = useContext(TracerContext);
        const [state, dispatch] = useReducer(reducer, initialState);

        const available = isDeposit
            ? balances.tokenBalance
            : balances.totalMargin.minus(calcMinimumMargin(balances.quote, balances.base, fairPrice, maxLeverage));
        const newBalance = isDeposit ? balances.quote.plus(state.amount) : balances.quote.minus(state.amount);

        const checkErrors = useCallback(() => {
            if (state.amount > available.toNumber()) {
                return 'INSUFFICIENT_FUNDS';
            } else if (
                (state.amount < calcMinimumMargin(balances.quote, balances.base, fairPrice, maxLeverage).toNumber() ||
                    // TODO remove 160 for dynamic calculation of liquidation gas cost
                    state.amount < 150 - balances.totalMargin.toNumber()) &&
                isDeposit
            ) {
                return 'DEPOSIT_MORE';
            } else if (
                balances.totalMargin.lt(
                    calcMinimumMargin(newBalance, balances.base, fairPrice, maxLeverage ?? defaults.maxLeverage),
                )
            ) {
                return 'WITHDRAW_INVALID';
            }
            return 'NO_ERROR';
        }, [state.amount]);

        const handleClose = () => {
            dispatch({ type: 'setAmount', amount: NaN });
            dispatch({ type: 'setLoading', loading: false });
            dispatch({ type: 'setTitles', title: 'Deposit Margin', subTitle: '' });
            close();
        };

        useMemo(() => {
            if (isDeposit) {
                dispatch({ type: 'setTitles', title: 'Deposit Margin', subTitle: '' });
            } else {
                dispatch({ type: 'setTitles', title: 'Withdraw Margin', subTitle: '' });
            }
        }, [isDeposit]);
        return (
            <TracerModal
                loading={state.loading}
                className={className}
                show={display}
                title={state.title}
                subTitle={state.subTitle}
                onClose={() => handleClose()}
            >
                <SSlideSelect value={isDeposit ? 0 : 1} onClick={(val) => setDeposit(val === 0)}>
                    <Option>Deposit</Option>
                    <Option>Withdraw</Option>
                </SSlideSelect>
                <SNumberSelect
                    unit={unit}
                    title={'Amount'}
                    amount={state.amount}
                    balance={parseFloat(available.toFixed(2))}
                    setAmount={(amount: number) => dispatch({ type: 'setAmount', amount: amount })}
                />
                <SHiddenExpand defaultHeight={0} open={!!state.amount}>
                    <p className="mb-3">{isDeposit ? 'Deposit' : 'Withdraw'} Summary</p>
                    <Section label={`Equity`}>
                        <Previous>{`${toApproxCurrency(balances.totalMargin)}`}</Previous>
                        {`${toApproxCurrency(calcTotalMargin(newBalance, balances.base, fairPrice))}`}
                    </Section>
                    <Section label={`Buying Power`}>
                        <Previous>{`${toApproxCurrency(
                            calcBuyingPower(balances.quote, balances.base, fairPrice, maxLeverage),
                        )}`}</Previous>
                        {`${toApproxCurrency(calcBuyingPower(newBalance, balances.base, fairPrice, maxLeverage))}`}
                    </Section>
                    <Section label={`Available Margin`}>
                        <Previous>{`${calcAvailableMarginPercent(
                            balances.quote,
                            balances.base,
                            fairPrice,
                            maxLeverage,
                        ).toPrecision(3)}%`}</Previous>
                        {`${calcAvailableMarginPercent(newBalance, balances.base, fairPrice, maxLeverage).toPrecision(
                            3,
                        )}%`}
                    </Section>
                </SHiddenExpand>
                <div className="text-center">
                    {isDeposit && !selectedTracer?.getTracerApproved() ? (
                        <ApproveButton
                            className="primary"
                            disabled={selectedTracer?.getTracerApproved()}
                            onClick={() => {
                                dispatch({ type: 'setLoading', loading: true });
                                dispatch({
                                    type: 'setTitles',
                                    title: 'Waiting for Confirmation',
                                    subTitle: 'Confirm the transaction in your wallet to unlock USD',
                                });
                                approve(selectedTracer?.address ?? '', {
                                    afterConfirmation: () => {
                                        dispatch({ type: 'setLoading', loading: false });
                                        dispatch({
                                            type: 'setTitles',
                                            title: isDeposit ? 'Deposit Margin' : 'Withdraw Margin',
                                            subTitle: '',
                                        });
                                    },
                                });
                            }}
                        >
                            Approve USD
                        </ApproveButton>
                    ) : null}
                    <ModalButton
                        disabled={!selectedTracer?.getTracerApproved() || checkErrors() !== 'NO_ERROR' || !state.amount}
                        onClick={() => {
                            dispatch({ type: 'setLoading', loading: true });
                            dispatch({
                                type: 'setTitles',
                                title: 'Waiting for Confirmation',
                                subTitle: `Confirm the transaction in your wallet to ${
                                    isDeposit ? 'deposit' : 'withdraw'
                                } USD`,
                            });
                            isDeposit ? deposit(state.amount, handleClose) : withdraw(state.amount, handleClose);
                        }}
                    >
                        {isDeposit ? 'Deposit' : 'Withdraw'}
                    </ModalButton>
                </div>
                <ErrorComponent context="margin" error={checkErrors()} />
            </TracerModal>
        );
    },
)`
    max-width: 434px !important;
` as React.FC<AMProps>;
