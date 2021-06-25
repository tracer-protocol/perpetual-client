import React, { useContext, useEffect, useState } from 'react';
import { TracerContext } from '@context/TracerContext';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import { Children } from 'types';
import { toApproxCurrency } from '@libs/utils';
import SlideSelect from '@components/Buttons/SlideSelect';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Checkbox, Dropdown, HiddenExpand, Previous, NumberSelect, Section } from '@components/General';
import TracerModal from '@components/General/TracerModal';
import styled from 'styled-components';
import { CaretDownFilled } from '@ant-design/icons';

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
    & svg {
        transition: 0.3s ease-in-out;
    }
    .open .preview & svg {
        transform: rotate(-180deg);
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
    padding: 0 40px 0 10px;
    color: var(--color-text);

    > .highlight {
        color: #f15025;
    }
`;

const SHiddenExpand = styled(HiddenExpand)`
    margin-top: 1rem;
    margin-bottom: 1rem;
    & > .body {
        padding: 10px 0;
    }
`;

const WithdrawalFee = styled(Section)`
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
`;

type BProps = {
    type: 'Deposit' | 'Withdraw';
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
} & Children;
export const InsuranceModal: React.FC<BProps> = ({ type, show, setShow }: BProps) => {
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { poolInfo, deposit, withdraw } = useContext(InsuranceContext);
    const [isDeposit, setIsDeposit] = useState(true);
    const poolBalance = poolInfo?.userBalance ?? defaults.userBalance;
    const balance = isDeposit ? selectedTracer?.getBalance().tokenBalance : poolBalance;
    const [valid, setValid] = useState(false);
    const [amount, setAmount] = useState(NaN); // The amount within the input
    const [acceptedTerms, acceptTerms] = useState(false);
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
            if (!!deposit && !!withdraw) {
                isDeposit ? deposit(amount, callback) : withdraw(amount, callback);
            }
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
                setShow(false);
            }}
            title={`${tracerId} Insurance Pool`}
        >
            <SSlideSelect onClick={(index: number, _e: any) => setIsDeposit(index === 0)} value={isDeposit ? 0 : 1}>
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
                            <SDown />
                        </DepositTermsHeader>
                    }
                    body={
                        <DepositTerms>
                            When you deposit insurance, you will receive insurance tokens proportionate to your deposit,
                            which will earn fees. You can withdraw your funds by burning your tokens at any time. At the
                            time of withdrawal,{' '}
                            <span className="highlight">
                                you will be required to pay a withdrawal fee if the current value of the insurance fund
                                is less than the target.
                            </span>
                        </DepositTerms>
                    }
                />
            ) : null}
            <NumberSelect
                unit={tracerId?.split('/')[1] ?? 'NO_ID'}
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
                <SSection label={`Pool Ownership`}>
                    <Previous>{`${toApproxCurrency(poolBalance)}`}</Previous>
                    {`${toApproxCurrency(newBalance)}`}
                </SSection>
                {/*<SSection label={`Pool Balance`}>*/}
                {/*    <Previous>{`${toApproxCurrency(poolBalance)}`}</Previous>*/}
                {/*    {`${toApproxCurrency(newBalance)}`}*/}
                {/*</SSection>*/}
                {isDeposit ? null : (
                    <>
                        <WithdrawalFee label="Withdrawal Fee (Without Gas)">{`${toApproxCurrency(0)}`}</WithdrawalFee>
                        <SSection
                            label="Total Return"
                            tooltip={{ key: 'total-return', props: { baseTicker: selectedTracer?.baseTicker } }}
                        >{`${toApproxCurrency(0)}`}</SSection>
                    </>
                )}
                {/*<SSection label="Predicted Date for Profitable Withdrawal">*/}
                {/*    {new Date().toLocaleDateString('en-US', {*/}
                {/*        year: 'numeric',*/}
                {/*        month: 'long',*/}
                {/*        day: 'numeric',*/}
                {/*    })}*/}
                {/*</SSection>*/}
            </SHiddenExpand>
            {isDeposit ? null : (
                <WithdrawalNote className="mb-8">
                    <span className="title">Note:</span> The value of the insurance fund is less than the target and you
                    are required to pay a withdrawal fee. Do you wish to proceed with the withdrawal?
                </WithdrawalNote>
            )}
            {isDeposit ? (
                <CheckboxContainer
                    onClick={(e: any) => {
                        e.preventDefault();
                        acceptTerms(!acceptedTerms);
                    }}
                >
                    <Checkbox checked={acceptedTerms} />
                    <CheckboxTitle>I have read and accept Terms of Deposit</CheckboxTitle>
                </CheckboxContainer>
            ) : (
                <CheckboxContainer
                    onClick={(e: any) => {
                        e.preventDefault();
                        acceptTerms(!acceptedTerms);
                    }}
                >
                    <Checkbox checked={acceptedTerms} />
                    <CheckboxTitle>I wish to proceed</CheckboxTitle>
                </CheckboxContainer>
            )}
            <div className="flex items-center justify-center px-6 pt-6 rounded-b" id="insurance-submit">
                {valid ? (
                    <Button onClick={() => submit(amount)}>{isDeposit ? 'Deposit' : 'Withdraw'}</Button>
                ) : (
                    <Button className="disabled">{isDeposit ? 'Deposit' : 'Withdraw'}</Button>
                )}
            </div>
        </TracerModal>
    );
};
