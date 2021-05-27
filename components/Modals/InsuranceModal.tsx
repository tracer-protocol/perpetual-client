import React, { useContext, useEffect, useState } from 'react';
import { TracerContext } from '@context/TracerContext';
import { InsuranceContext, defaults } from '@context/InsuranceContext';
import { TransactionContext } from '@context/TransactionContext';
import { Children } from 'types';
import { toApproxCurrency } from '@libs/utils';
import SlideSelect from '../Buttons/SlideSelect';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Checkbox, Dropdown, HiddenExpand, Previous, NumberSelect, Section } from '@components/General';
import styled from 'styled-components';
import TracerModal, { SubTitle } from './Modal';
import { CaretDownFilled } from '@ant-design/icons';

const SSlideSelect = styled(SlideSelect)`
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #ffffff;
    width: 300px;
    height: 40px;
    margin-left: 0;
`;

const SDown = styled(CaretDownFilled)`
    font-size: 20px;
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
    padding: 0 10px;
    color: #fff;
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
        color: #fff;
        padding: 0 10px;
    }
    .content {
        padding-right: 10px;
        color: #fff;
    }
`;

const SSection = styled(Section)`
    padding: 5px 10px;
    margin: 0;
`;

const AcceptTerms = styled.span`
    line-height: 1.3rem;
    margin-left: 1rem;
`;

const profitibleWithdrawTip = (
    <p>
        <strong>Predicted Date for Profitable Withdrawal:</strong> Estimated date for profitable withdrawal despite
        withdrawal fee. Assuming current gross APY continues with no expenses to the insurance fund.This trade will use
        funds from your connected Web3 wallet.
    </p>
);

const rewardsTip = (
    <p>
        <strong>Rewards:</strong> You will receive insurance tokens representing your deposit, which will earn fees.
    </p>
);

const ownershipTip = (
    <p>
        <strong>Pool Ownership</strong>
        <br />
        <Previous>0 USDC</Previous>
        <span className="text-white">4.5 USDC</span>
        <br />
        <Previous>0 iBTC-USDC</Previous>
        <span className="text-white">4.5 iBTC-USDC</span>
        <br />
        <Previous>0%</Previous>
        <span className="text-white">4%</span>
    </p>
);

type BProps = {
    type: 'Deposit' | 'Withdraw';
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
} & Children;
export const InsuranceModal: React.FC<BProps> = ({ type, show, setShow }: BProps) => {
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { poolInfo, deposit, withdraw } = useContext(InsuranceContext);
    const { handleTransaction } = useContext(TransactionContext);
    const [isDeposit, setIsDeposit] = useState(true);
    const tracerBalance = selectedTracer?.balances;
    const poolBalance = poolInfo?.userBalance ?? defaults.userBalance;
    const balance = isDeposit ? tracerBalance?.tokenBalance : poolBalance;
    const [valid, setValid] = useState(false);
    const [amount, setAmount] = useState(0); // The amount within the input
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
            const t = isDeposit ? 'deposit' : 'withdraw';
            withdraw && deposit && handleTransaction
                ? handleTransaction(isDeposit ? deposit : withdraw, [amount], { callback })
                : console.error(`Failed to ${t} from insurance pool: No deposit function found`);
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
            title={isDeposit ? 'Deposit Insurance' : 'Withdraw Insurance'}
            subTitle={
                isDeposit
                    ? `Add insurance to the ${tracerId} insurance pool for a specified period of time.`
                    : `Withdraw from the ${tracerId} insurance pool`
            }
        >
            <div className="p-6 flex-auto">
                <SSlideSelect onClick={(index: number, _e: any) => setIsDeposit(index === 0)} value={isDeposit ? 0 : 1}>
                    <Option>Deposit</Option>
                    <Option>Withdraw</Option>
                </SSlideSelect>
                <SubTitle>
                    {isDeposit
                        ? `Deposit funds to the ${tracerId} insurance pool`
                        : `Withdraw funds from the ${tracerId} insurance pool`}
                </SubTitle>
                {isDeposit ? (
                    <Dropdown
                        defaultHeight={50}
                        header={
                            <DepositTermsHeader>
                                <span>Terms of deposit</span>
                                <SDown />
                            </DepositTermsHeader>
                        }
                        body={
                            <DepositTerms>
                                When you deposit insurance, you will receive insurance tokens representing your deposit,
                                which will earn fees. You can withdraw your funds buy burning your tokens at any time.
                                At the time of withdrawal, if the current value of the insurance fund does not reach the
                                target, you will be required to pay a withdrawal fee. To understand more about the
                                withdrawal fee, view Tracer Documentation.
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
                    <SSection label={`Pool Ownership`} tooltip={ownershipTip}>
                        <Previous>{`${toApproxCurrency(poolBalance)}`}</Previous>
                        {`${toApproxCurrency(newBalance)}`}
                    </SSection>
                    <SSection label={`Pool Balance`}>
                        <Previous>{`${toApproxCurrency(poolBalance)}`}</Previous>
                        {`${toApproxCurrency(newBalance)}`}
                    </SSection>
                    <WithdrawalFee label="Withdrawal Fee (Without Gas)">{`${toApproxCurrency(0)}`}</WithdrawalFee>
                    <SSection label="Total Return" tooltip={rewardsTip}>{`${toApproxCurrency(0)}`}</SSection>
                    <SSection label="Predicted Date for Profitable Withdrawal" tooltip={profitibleWithdrawTip}>
                        {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </SSection>
                </SHiddenExpand>
                {isDeposit ? (
                    <div className="flex">
                        <Checkbox
                            checked={acceptedTerms}
                            onClick={(e: any) => {
                                e.preventDefault();
                                acceptTerms(!acceptedTerms);
                            }}
                        />
                        <AcceptTerms>I have read and accept Terms of Withdrawal</AcceptTerms>
                    </div>
                ) : null}
                <div className="flex items-center justify-center p-6 rounded-b" id="insurance-submit">
                    {valid ? (
                        <Button onClick={() => submit(amount)}>
                            {isDeposit ? 'Add Insurance' : 'Withdraw Insurance'}
                        </Button>
                    ) : (
                        <Button className="disabled">{isDeposit ? 'Add Insurance' : 'Withdraw Insurance'}</Button>
                    )}
                </div>
            </div>
        </TracerModal>
    );
};
