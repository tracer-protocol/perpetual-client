import React, { useContext, useEffect, useState } from 'react';
import { TracerContext } from '@context/TracerContext';
import { InsuranceContext } from '@context/InsuranceContext';
import TracerModal from '@components/Modals';
import { Section } from '@components/SummaryInfo';
import { Children } from 'types';
import { TransactionContext } from '@components/context/TransactionContext';
import NumberSelect from '../Input/NumberSelect';
import { toApproxCurrency } from '@libs/utils';
import { calcInsurancePoolHealth } from '@libs/utils/InsuranceCalcs';
import SlideSelect from '../Buttons/SlideSelect';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Dropdown } from '@components/General';
import styled from 'styled-components';
import { SubTitle } from './Modal';
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

type BProps = {
    type: 'Deposit' | 'Withdraw';
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
} & Children;
export const InsuranceModal: React.FC<BProps> = ({ type, show, setShow }: BProps) => {
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { poolInfo, deposit, withdraw } = useContext(InsuranceContext);
    const { handleTransaction } = useContext(TransactionContext);
    const [loading, setLoading] = useState(false);
    const [isDeposit, setIsDeposit] = useState(true);
    const tracerBalance = selectedTracer?.balances;

    const poolBalance = poolInfo?.userBalance ?? 0;
    const balance = isDeposit ? tracerBalance?.tokenBalance : poolBalance;
    const [valid, setValid] = useState(false);
    const [amount, setAmount] = useState(0); // The amount within the input
    useEffect(() => {
        setIsDeposit(type === 'Deposit');
    }, [type]);
    const amount_ = !Number.isNaN(amount) ? amount : 0;
    const newBalance = isDeposit ? poolBalance + amount_ : poolBalance - amount_;
    useEffect(() => {
        setValid(amount > 0 && amount <= (balance ?? 0));
    }, [balance, amount]);

    const submit = async (amount: number) => {
        try {
            setLoading(true);
            const callback = () => {
                setLoading(false);
            };
            const t = isDeposit ? 'deposit' : 'withdraw';
            withdraw && deposit && handleTransaction
                ? handleTransaction(isDeposit ? deposit : withdraw, [amount], callback)
                : console.error(`Failed to ${t} from insurance pool: No deposit function found`);
        } catch (err) {
            console.error(`Failed to deposit into insurance pool: ${err}`);
        }
    };

    return (
        <TracerModal
            loading={loading}
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
                    <Dropdown defaultHeight={50}>
                        <DepositTermsHeader>
                            <span>Terms of deposit</span>
                            <SDown />
                        </DepositTermsHeader>
                        <DepositTerms>
                            When you deposit insurance, you will receive insurance tokens representing your deposit,
                            which will earn fees. You can withdraw your funds buy burning your tokens at any time. At
                            the time of withdrawal, if the current value of the insurance fund does not reach the
                            target, you will be required to pay a withdrawal fee. To understand more about the
                            withdrawal fee, view Tracer Documentation.
                        </DepositTerms>
                    </Dropdown>
                ) : null}
                <NumberSelect
                    unit={tracerId?.split('/')[1] ?? 'NO_ID'}
                    title={'Amount'}
                    amount={amount}
                    balance={balance}
                    setAmount={setAmount}
                />
                <div className="">
                    <div>
                        <Section label={`Your Share`}>
                            {`${toApproxCurrency(poolBalance)}`}
                            {'  ->  '}
                            {`${toApproxCurrency(newBalance)}`}
                        </Section>
                        <Section label={`Insurance Pool Health`}>
                            {`${calcInsurancePoolHealth(poolInfo?.target, poolInfo?.liquidity) * 100}%`}
                            {'  ->  '}
                            {`${(poolInfo?.target, poolInfo?.liquidity ?? 0 - amount_) * 100}%`}
                        </Section>
                    </div>
                </div>
                <div className="flex items-center justify-center p-6 rounded-b">
                    {!valid ? (
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
