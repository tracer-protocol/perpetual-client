import React, { useContext, useReducer } from 'react';
import styled from 'styled-components';
import { OrderContext, TracerContext } from 'context';
import { BigNumber } from 'bignumber.js';
import DefaultSlider from '@components/General/Slider';
import { UserBalance } from 'libs/types';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import TracerModal, { ModalAction, modalReducer, ModalState } from '@components/General/TracerModal';
import { Button, HiddenExpand, LockContainer, NumberSelect } from '@components/General';
import ErrorComponent, { CalculatorErrors, ErrorKey } from '@components/General/Error';
import { NumberSelectHeader } from '@components/General/Input/NumberSelect';
import {
    CalculatorContext,
    ContextProps,
    LOCK_EXPOSURE,
    LOCK_MARGIN,
    LOCK_LEVERAGE,
    LOCK_LIQUIDATION,
    CalculatorAction,
} from '@context/CalculatorContext';
import { defaults } from '@libs/Tracer';
import { InfoCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { toApproxCurrency } from '@libs/utils';
import { CalculatorTip } from '@components/Tooltips';
import { LONG } from '@libs/types/OrderTypes';
import { Options } from '@context/TransactionContext';

type CalculatorModalProps = {
    className?: string;
    close: () => any;
    display: boolean;
    quoteTicker: string;
    baseTicker: string;
    balances: UserBalance;
    fairPrice: BigNumber;
};

const initialState: ModalState = {
    amount: NaN,
    loading: false,
    title: 'Calculator',
    subTitle: '',
};

export default styled(
    ({ className, close, baseTicker, quoteTicker, balances, display, fairPrice }: CalculatorModalProps) => {
        const {
            selectedTracer,
            deposit = () => console.error('Deposit is not defined'),
            approve = () => console.error('Approve is not defined'),
        } = useContext(TracerContext);
        const {
            calculatorState: {
                exposure,
                margin,
                liquidationPrice,
                leverage,
                position,
                displayLocks,
                showResult,
                error,
                locked,
            },
            calculatorDispatch,
        } = useContext(CalculatorContext) as ContextProps;
        const { orderDispatch = () => console.error('Order dispatch not set') } = useContext(OrderContext);
        const [modalState, modalDispatch] = useReducer(modalReducer, initialState);

        const closeAfterDeposit = () => {
            modalDispatch({ type: 'setLoading', loading: false });
            modalDispatch({
                type: 'setSubTitle',
                subTitle: '',
            });
            calculatorDispatch({ type: 'reset' });
            close();
            orderDispatch({ type: 'setExposure', value: exposure });
            orderDispatch({ type: 'setPosition', value: position });
            orderDispatch({ type: 'setLeverageFromExposure', amount: exposure });
        };
        const isLocked = (locked: number[], value: number) => locked[0] === value || locked[1] === value;
        return (
            <TracerModal
                loading={modalState.loading}
                className={className}
                show={display}
                title={
                    <p>
                        {`${selectedTracer?.marketId} Calculator`}
                        <CalculatorTip>
                            <InfoBox />
                        </CalculatorTip>
                    </p>
                }
                subTitle={modalState.subTitle}
                onClose={close}
            >
                <CalcSelectContainer>
                    <CalcSlideSelect
                        value={position}
                        onClick={() => {
                            calculatorDispatch({ type: 'setPosition' });
                            calculatorDispatch({ type: 'calculate' });
                        }}
                    >
                        <Option>Long</Option>
                        <Option>Short</Option>
                    </CalcSlideSelect>
                </CalcSelectContainer>

                <AccountNumberSelect
                    unit={baseTicker}
                    title={'Exposure'}
                    amount={exposure}
                    setAmount={(val) => {
                        calculatorDispatch({
                            type: Number.isNaN(val) ? 'unlockValue' : 'lockValue',
                            value: LOCK_EXPOSURE,
                        });
                        calculatorDispatch({ type: 'setExposure', value: Math.abs(val) });
                        calculatorDispatch({ type: 'calculate' });
                    }}
                    displayLock={displayLocks}
                    isLocked={isLocked(locked, LOCK_EXPOSURE)}
                    lockOnClick={() =>
                        calculatorDispatch({
                            type: isLocked(locked, LOCK_EXPOSURE) ? 'unlockValue' : 'lockValue',
                            value: LOCK_EXPOSURE,
                        })
                    }
                />

                <AccountNumberSelect
                    unit={quoteTicker}
                    title={'Margin'}
                    amount={margin}
                    balance={balances.tokenBalance.toNumber()}
                    setMax={(_e) => {
                        calculatorDispatch({
                            type: 'lockValue',
                            value: LOCK_MARGIN,
                        });
                        calculatorDispatch({
                            type: 'setMargin',
                            value: parseFloat(balances.tokenBalance.toFixed(5)),
                        });
                    }}
                    setAmount={(val) => {
                        calculatorDispatch({
                            type: Number.isNaN(val) ? 'unlockValue' : 'lockValue',
                            value: LOCK_MARGIN,
                        });
                        calculatorDispatch({ type: 'setMargin', value: Math.abs(val) });
                        calculatorDispatch({ type: 'calculate' });
                    }}
                    displayLock={displayLocks}
                    isLocked={isLocked(locked, LOCK_MARGIN)}
                    lockOnClick={() =>
                        calculatorDispatch({
                            type: isLocked(locked, LOCK_MARGIN) ? 'unlockValue' : 'lockValue',
                            value: LOCK_MARGIN,
                        })
                    }
                />

                <Leverage
                    value={leverage}
                    isLocked={isLocked(locked, LOCK_LEVERAGE)}
                    calculatorDispatch={calculatorDispatch}
                    maxLeverage={selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage}
                />

                <AccountNumberSelect
                    unit={quoteTicker}
                    title={'Liquidation Price'}
                    amount={liquidationPrice}
                    setAmount={(val) => {
                        calculatorDispatch({
                            type: Number.isNaN(val) ? 'unlockValue' : 'lockValue',
                            value: LOCK_LIQUIDATION,
                        });
                        calculatorDispatch({ type: 'setLiquidationPrice', value: Math.abs(val) });
                        calculatorDispatch({ type: 'calculate' });
                    }}
                    isLocked={isLocked(locked, LOCK_LIQUIDATION)}
                    displayLock={displayLocks}
                    lockOnClick={() =>
                        calculatorDispatch({
                            type: isLocked(locked, LOCK_LIQUIDATION) ? 'unlockValue' : 'lockValue',
                            value: LOCK_LIQUIDATION,
                        })
                    }
                    header={
                        <NumberSelectHeader>
                            {'Liquidation Price'}
                            <FairPrice>Fair Price: {toApproxCurrency(fairPrice)}</FairPrice>
                        </NumberSelectHeader>
                    }
                />
                <StyledHiddenExpand defaultHeight={0} open={showResult}>
                    <p className="title">Calculator Summary</p>
                    <p>
                        {error === 'NO_ERROR' || CalculatorErrors[error].severity
                            ? `
                            Deposit ${toApproxCurrency(margin)} margin and open a ${
                                  position === LONG ? 'LONG' : 'SHORT'
                              } 
                            position of ${parseFloat(
                                exposure.toFixed(2),
                            )} ${baseTicker} to achieve account leverage of ${leverage}x. 
                            This position will be liquidated at ${toApproxCurrency(liquidationPrice)}.`
                            : 'Invalid calculated position. Try increasing your margin or decreasing your exposure'}
                    </p>
                    <DepositButtons
                        tracerApproved={selectedTracer?.getTracerApproved() ?? false}
                        tracerAddress={selectedTracer?.address ?? ''}
                        quoteTicker={selectedTracer?.quoteTicker ?? ''}
                        depositAmount={margin}
                        error={error}
                        deposit={deposit}
                        approve={approve}
                        dispatch={modalDispatch}
                        handleClose={closeAfterDeposit}
                    />
                </StyledHiddenExpand>
                <CalcButtons>
                    <SButton
                        onClick={(e) => {
                            e.preventDefault();
                            calculatorDispatch({ type: 'setShowResult', value: true });
                            calculatorDispatch({ type: 'calculate' });
                        }}
                    >
                        Calculate
                    </SButton>
                    <SButton
                        onClick={(e) => {
                            e.preventDefault();
                            calculatorDispatch({ type: 'reset' });
                        }}
                    >
                        Reset
                    </SButton>
                </CalcButtons>
                <ErrorComponent error={error} context="calculator" />
            </TracerModal>
        );
    },
)`
    max-width: 434px !important;
` as React.FC<CalculatorModalProps>;

const InfoBox = styled(InfoCircleOutlined)`
    vertical-align: 0.125rem;
    color: var(--color-primary);
    margin-left: 0.4rem;
`;

const StyledHiddenExpand = styled(HiddenExpand)`
    background: var(--color-accent);
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: var(--color-primary);
    margin-top: 1rem;
    p.title {
        color: #fff;
    }
`;

const CalcSelectContainer = styled.div`
    margin-top: 1rem;
    border-top: 1px solid var(--color-accent);
`;

const CalcSlideSelect = styled(SlideSelect)`
    max-width: 300px;
    height: var(--height-medium-button);
    margin: 1rem auto;
`;

const SButton = styled(Button)`
    height: var(--height-small-button);
`;

const CalcButtons = styled.div`
    display: flex;
    justify-content: space-around;
`;

const AccountNumberSelect = styled(NumberSelect)`
    margin-top: 1rem;
    > * .balance {
        color: var(--color-primary);
    }
    opacity: ${(props) => (!props.isLocked ? 0.5 : 1)};

    > * input {
        &::placeholder {
            /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: var(--color-secondary);
            opacity: 1; /* Firefox */
        }

        &:-ms-input-placeholder {
            /* Internet Explorer 10-11 */
            color: var(--color-secondary);
        }

        &::-ms-input-placeholder {
            /* Microsoft Edge */
            color: var(--color-secondary);
        }
    }
`;

const FairPrice = styled.span`
    color: var(--color-secondary);
    margin-left: auto;
`;

type LProps = {
    className?: string;
    value: number;
    maxLeverage: BigNumber;
    isLocked: boolean;
    calculatorDispatch: React.Dispatch<CalculatorAction>;
};
const Leverage: React.FC<LProps> = styled(({ className, value, maxLeverage, isLocked, calculatorDispatch }: LProps) => {
    return (
        <div className={className}>
            <h3>Leverage</h3>
            <LockContainer>
                {isLocked ? (
                    <LockOutlined
                        onClick={() => {
                            calculatorDispatch({ type: 'unlockValue', value: LOCK_LEVERAGE });
                        }}
                    />
                ) : (
                    <UnlockOutlined
                        onClick={() => {
                            calculatorDispatch({ type: 'lockValue', value: LOCK_LEVERAGE });
                        }}
                    />
                )}
            </LockContainer>
            <DefaultSlider
                className="px-5"
                value={value}
                handleChange={(val) => {
                    calculatorDispatch({ type: val === 0 ? 'unlockValue' : 'lockValue', value: LOCK_LEVERAGE });
                    calculatorDispatch({ type: 'setLeverage', value: val });
                    calculatorDispatch({ type: 'calculate' });
                }}
                step={0.1}
                min={0}
                defaultValue={0}
                max={maxLeverage.toNumber()}
            />
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    margin-bottom: 4rem;
    position: relative;

    opacity: ${(props) => (!props.isLocked ? 0.5 : 1)};

    ${LockContainer} {
        position: absolute;
        right: 20px;
        top: 15%;
    }

    > h3 {
        font-size: var(--font-size-small);
        color: var(--color-primary);
        margin-bottom: 1rem;
    }
`;

type DepositButtons = {
    tracerApproved: boolean;
    tracerAddress: string;
    quoteTicker: string;
    error: ErrorKey;
    deposit: (amount: number, options: Options) => void;
    approve: (contract: string, options: Options) => void;
    depositAmount: number;
    handleClose: () => any;
    dispatch: React.Dispatch<ModalAction>;
};

const DepositButtons: React.FC<DepositButtons> = ({
    tracerApproved,
    error,
    deposit,
    approve,
    tracerAddress,
    depositAmount,
    handleClose,
    dispatch,
    quoteTicker,
}) => {
    const closeLoading = () => {
        dispatch({ type: 'setLoading', loading: false });
        dispatch({
            type: 'setSubTitle',
            subTitle: '',
        });
    };
    return (
        <div className="text-center">
            {!tracerApproved ? (
                <SButton
                    className="primary mr-2"
                    disabled={tracerApproved}
                    onClick={() => {
                        dispatch({ type: 'setLoading', loading: true });
                        dispatch({
                            type: 'setSubTitle',
                            subTitle: `Confirm the transaction in your wallet to unlock ${quoteTicker}`,
                        });
                        approve(tracerAddress, {
                            afterConfirmation: () => {
                                dispatch({ type: 'setLoading', loading: false });
                                dispatch({
                                    type: 'setSubTitle',
                                    subTitle: '',
                                });
                            },
                            onError: closeLoading,
                            onSuccess: closeLoading,
                        });
                    }}
                >
                    Approve {quoteTicker}
                </SButton>
            ) : null}
            <SButton
                className={`${error === 'NO_ERROR' || CalculatorErrors[error].severity ? 'primary' : ''} mt-1`}
                disabled={error !== 'NO_ERROR' && !CalculatorErrors[error].severity}
                onClick={() => {
                    dispatch({ type: 'setLoading', loading: true });
                    dispatch({
                        type: 'setSubTitle',
                        subTitle: `Confirm the transaction in your wallet to deposit ${quoteTicker}`,
                    });
                    deposit(depositAmount, {
                        onSuccess: handleClose,
                        onError: closeLoading,
                    });
                }}
            >
                Deposit Margin
            </SButton>
        </div>
    );
};
