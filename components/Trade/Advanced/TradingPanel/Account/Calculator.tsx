import React, { useContext } from 'react';
import styled from 'styled-components';
import { TracerContext } from 'context';
import { BigNumber } from 'bignumber.js';
import DefaultSlider from '@components/General/Slider';
import { UserBalance } from 'types';
import { SlideSelect } from '@components/Buttons';
import TracerModal from '@components/General/TracerModal';
import { Button, HiddenExpand, LockContainer, NumberSelect } from '@components/General';
import { Option } from '@components/Buttons/SlideSelect';
import ErrorComponent from '@components/General/Error';
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
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { toApproxCurrency } from '@libs/utils';

type CalculatorModalProps = {
    className?: string;
    close: () => any;
    display: boolean;
    quoteTicker: string;
    baseTicker: string;
    balances: UserBalance;
    fairPrice: BigNumber;
};
export default styled(({ className, close, baseTicker, quoteTicker, balances, display }: CalculatorModalProps) => {
    const { selectedTracer } = useContext(TracerContext);
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

    const isLocked = (locked: number[], value: number) => locked[0] === value || locked[1] === value;
    return (
        <TracerModal
            loading={false}
            className={className}
            show={display}
            title={`${selectedTracer?.marketId} Calculator`}
            onClose={close}
        >
            <CalcSelectContainer>
                <CalcSlideSelect value={position} onClick={() => calculatorDispatch({ type: 'setPosition' })}>
                    <Option>Long</Option>
                    <Option>Short</Option>
                </CalcSlideSelect>
            </CalcSelectContainer>

            <AccountNumberSelect
                unit={baseTicker}
                title={'Exposure'}
                amount={exposure}
                setAmount={(val) => {
                    calculatorDispatch({ type: 'setExposure', value: val });
                    calculatorDispatch({
                        type: Number.isNaN(val) ? 'unlockValue' : 'lockValue',
                        value: LOCK_EXPOSURE,
                    });
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
                setAmount={(val) => {
                    calculatorDispatch({ type: 'setMargin', value: val });
                    calculatorDispatch({
                        type: Number.isNaN(val) ? 'unlockValue' : 'lockValue',
                        value: LOCK_MARGIN,
                    });
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
                // balance={parseFloat(fairPrice.toFixed(2))}
                setAmount={(val) => {
                    calculatorDispatch({ type: 'setLiquidationPrice', value: val });
                    calculatorDispatch({
                        type: Number.isNaN(val) ? 'unlockValue' : 'lockValue',
                        value: LOCK_LIQUIDATION,
                    });
                }}
                isLocked={isLocked(locked, LOCK_LIQUIDATION)}
                displayLock={displayLocks}
                lockOnClick={() =>
                    calculatorDispatch({
                        type: isLocked(locked, LOCK_LIQUIDATION) ? 'unlockValue' : 'lockValue',
                        value: LOCK_LIQUIDATION,
                    })
                }
            />
            <StyledHiddenExpand defaultHeight={0} open={showResult}>
                <p className="title">Calculator Summary</p>
                <p>
                    {error === 'NO_ERROR'
                        ? `Deposit ${toApproxCurrency(margin)} margin to open trade, or continue editing.`
                        : `Invalid calculated position. Try increasing your margin or decreasing your exposure`}
                </p>
                <div className="text-center">
                    <SButton
                        className={`${error === 'NO_ERROR' ? 'primary' : ''} mt-1`}
                        disabled={error !== 'NO_ERROR'}
                    >
                        Deposit Margin
                    </SButton>
                </div>
            </StyledHiddenExpand>
            <CalcButtons>
                <SButton
                    onClick={(e) => {
                        e.preventDefault();
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
})`
    max-width: 434px !important;
` as React.FC<CalculatorModalProps>;

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
    line-height: 28px;
    padding: 0;
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
                    calculatorDispatch({ type: 'setLeverage', value: val });
                    calculatorDispatch({ type: val === 0 ? 'unlockValue' : 'lockValue', value: LOCK_LEVERAGE });
                }}
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
        top: 25%;
    }

    > h3 {
        font-size: var(--font-size-small);
        color: var(--color-primary);
        margin-bottom: 1rem;
    }
`;
