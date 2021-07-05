import React, { useContext, useEffect, useState } from 'react';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import { Children } from 'types';
import { toApproxCurrency } from '@libs/utils';
import SlideSelect from '@components/Buttons/SlideSelect';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Checkbox, Dropdown, HiddenExpand, Previous, NumberSelect, Section } from '@components/General';
import TracerModal from '@components/General/TracerModal';
import styled from 'styled-components';
import { CaretDownFilled } from '@ant-design/icons';
import ErrorComponent from '@components/General/Error';
import Tracer from '@libs/Tracer';
import BigNumber from 'bignumber.js';

const SSlideSelect = styled(SlideSelect)`
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: #ffffff;
    width: 300px;
    height: 40px;
    margin-top: 1rem;
    margin-bottom: 2rem;
    margin-left: 0;
`;

const SDown = styled(CaretDownFilled)`
    font-size: var(--font-size-medium);
    transition: 0.3s ease-in-out;
    transform: translateY(6px);

    .open & {
        transform: rotate(-180deg) translateY(6px);
    }
`;

const DepositTermsHeader = styled.p`
    justify-content: space-between;
    display: flex;
    padding: 10px;
    height: 50px;
    line-height: 30px;
`;

const DepositTerms = styled.p`
    max-height: 180px;
    overflow-y: scroll;
    min-width: 550px;
    width: 100%;
    padding: 0 10px;
    color: var(--color-text);
`;

const SHiddenExpand = styled(HiddenExpand)`
    margin-top: 1rem;
    margin-bottom: 1rem;
    background: var(--color-accent);
`;

const PoolOwnershipInsufficient = styled(Section)`
    background: #f15025;
    background-size: 100%;
    border-bottom: 1px solid #011772;
    padding: 5px 0;
    margin: 0;

    .label {
        color: var(--color-text);
        padding: 0 10px;
    }
    .content {
        padding-right: 10px;
        color: var(--color-text);
    }
`;

const WithdrawalFee = styled(Section)`
    background: #f4ab57;
    background-size: 100%;
    border-bottom: 1px solid #011772;
    padding: 5px 0;
    margin: 0;

    .label {
        color: var(--color-text);
        padding: 0 10px;
    }
    .content {
        padding-right: 10px;
        color: var(--color-text);
    }
`;

const SSection = styled(Section)`
    padding: 5px 10px;
    margin: 0;

    &.title > .label {
        color: white;
    }
`;

const CheckboxContainer = styled.div`
    display: flex;
    cursor: pointer;
    width: fit-content;
`;

const CheckboxTitle = styled.span`
    margin-left: 0.5rem;
    margin-top: -0.2rem;
    font-size: var(--font-size-small);
`;

const WithdrawalNote = styled.div`
    background: var(--color-background);
    color: var(--color-text);
    font-size: var(--font-size-small);
    border-radius: 5px;
    padding: 10px;

    > .title {
        color: #3da8f5;
    }

    > .highlight {
        color: #f15025;
    }
`;

type BProps = {
    type: 'Deposit' | 'Withdraw';
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    tracer: Tracer;
    belowTarget: boolean 
    poolUserBalance: BigNumber;
} & Children;
export const InsuranceModal: React.FC<BProps> = ({ 
    type, show, setShow, tracer, poolUserBalance, belowTarget 
}: BProps) => {
    const {
        deposit = () => console.error('Deposit is not defined'),
        withdraw = () => console.error('Withdraw is not defined'),
        approve = () => console.error('Approve is not defined'),
    } = useContext(InsuranceContext);
    const [isDeposit, setIsDeposit] = useState(true);
    const poolBalance = poolUserBalance ?? defaults.userBalance;
    const balance = isDeposit ? tracer?.getBalance().tokenBalance : poolBalance;
    const [valid, setValid] = useState(false);
    const [amount, setAmount] = useState(NaN); // The amount within the input
    const [acceptedTerms, acceptTerms] = useState(false);
    const fee = 0; // TODO update this to not be 0
    useEffect(() => {
        setIsDeposit(type === 'Deposit');
    }, [type]);
    const amount_ = !Number.isNaN(amount) ? amount : 0;
    const newBalance = isDeposit ? poolBalance.plus(amount_) : poolBalance.minus(amount_);

    useEffect(() => {
        const amountValid = amount > 0 && amount <= (balance?.toNumber() ?? 0);
        if (isDeposit) {
            setValid(amountValid && acceptedTerms);
        } else {
            setValid(amountValid);
        }
    }, [balance, amount, acceptedTerms]);

    const submit = async (amount: number) => {
        try {
            const callback = () => {
                setShow(false);
            };
            isDeposit ? deposit(tracer, amount, callback) : withdraw(tracer, amount, callback);
        } catch (err) {
            console.error(`Failed to deposit into insurance pool: ${err}`);
        }
    };

    return (
        <TracerModal
            loading={false}
            show={show}
            id="insurance-modal"
            onClose={() => {
                setIsDeposit(type === 'Deposit');
                acceptTerms(false);
                setShow(false);
                setAmount(NaN);
            }}
            title={`${tracer.marketId} Insurance Pool`}
        >
            <SSlideSelect
                onClick={(index: number, _e: any) => {
                    setAmount(NaN); // reset amount
                    acceptTerms(false); // reset approval
                    setIsDeposit(index === 0);
                }}
                value={isDeposit ? 0 : 1}
            >
                <Option>Deposit</Option>
                <Option>Withdraw</Option>
            </SSlideSelect>
            {isDeposit ? (
                <Dropdown
                    defaultOpen={true}
                    defaultHeight={180}
                    header={
                        <DepositTermsHeader>
                            <span>Terms of deposit</span>
                            <SDown className="down-arrow" />
                        </DepositTermsHeader>
                    }
                    body={
                        <DepositTerms>
                            When you deposit funds into this insurance pool, you will receive insurance pool tokens
                            proportionate to your deposit, which will earn fees. You can withdraw your funds by burning
                            your tokens at any time. If, at the time of your withdrawal, the value of the insurance pool
                            is less than the insurance pool target, you will be required to pay a withdrawal fee.
                        </DepositTerms>
                    }
                />
            ) : null}
            <NumberSelect
                unit={`i${tracer.marketId?.replace('/', '-')}` ?? 'NO_ID'}
                title={'Amount'}
                amount={amount}
                balance={balance?.toNumber() ?? 0}
                setAmount={setAmount}
            />
            <SHiddenExpand defaultHeight={0} open={!!amount}>
                {isDeposit ? (
                    <SSection className={`title`} label={`Deposit Summary`} />
                ) : (
                    <SSection className={`title`} label={`Withdrawal Summary`} />
                )}
                {!isDeposit && amount > balance.toNumber() ? (
                    <PoolOwnershipInsufficient label={`Pool Ownership`}>
                        <Previous>{`${toApproxCurrency(poolBalance)}`}</Previous>
                        {`${toApproxCurrency(newBalance)}`}
                    </PoolOwnershipInsufficient>
                ) : (
                    <SSection label={`Pool Ownership`}>
                        <Previous>{`${toApproxCurrency(poolBalance)}`}</Previous>
                        {`${toApproxCurrency(newBalance)}`}
                    </SSection>
                )}
                {isDeposit || amount > balance.toNumber() ? null : (
                    <>
                        <WithdrawalFee label="Withdrawal Fee (Without Gas)">{`${toApproxCurrency(fee)}`}</WithdrawalFee>
                        <SSection
                            label="Total Return"
                            tooltip={{ key: 'total-return', props: { baseTicker: tracer?.baseTicker } }}
                        >{`${toApproxCurrency(amount - fee)}`}</SSection>
                    </>
                )}
            </SHiddenExpand>
            {(!isDeposit && belowTarget) ?  (
                <WithdrawalNote className="mb-8">
                    <span className="title">Note:</span> The value of the insurance pool is currently less than the
                    insurance pool target. If you choose to withdraw at this time,{' '}
                    <span className="highlight">you will be required to pay a withdrawal fee.</span>
                </WithdrawalNote>
            ) : null }
            {(!isDeposit && belowTarget) || isDeposit ?  (
                <CheckboxContainer
                    onClick={(e: any) => {
                        e.preventDefault();
                        acceptTerms(!acceptedTerms);
                    }}
                >
                    <Checkbox checked={acceptedTerms} />
                    <CheckboxTitle>{isDeposit ? 'I have read and accept Terms of Deposit' : 'I wish to proceed'}</CheckboxTitle>
                </CheckboxContainer>
                ) : null
            }
            <div className="flex items-center justify-center px-6 pt-6 rounded-b" id="insurance-submit">
                {isDeposit && !tracer?.getInsuranceApproved() ? (
                    <Button
                        className="primary"
                        disabled={tracer?.getInsuranceApproved()}
                        onClick={() => {
                            approve(tracer);
                        }}
                    >
                        Approve {tracer.quoteTicker}
                    </Button>
                ) : null}
                <Button disabled={!tracer?.getInsuranceApproved() || !valid} onClick={() => submit(amount)}>
                    {isDeposit ? 'Deposit' : 'Withdraw'}
                </Button>
            </div>
            <ErrorComponent context="margin" error={amount > balance.toNumber() ? 'INSUFFICIENT_FUNDS' : 'NO_ERROR'} />
        </TracerModal>
    );
};
