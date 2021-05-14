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
import SlideSelect from './SlideSelect';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button } from '@components/General';
import styled from 'styled-components';
import { SubTitle } from '../Modals/Modal';
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
`
const DepositTerms = styled(({ className }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${className} ${open ? 'open' : ''}`} onClick={(_e) => setOpen(!open)}>
            <div className="preview">
                <span>Terms of deposit</span>
                <SDown />
            </div>
            <p className="drop-down">
                When you deposit insurance, you will receive insurance tokens representing your deposit, which will earn fees. You can withdraw your funds buy burning your tokens at any time. At the time of withdrawal, if the current value of the insurance fund does not reach the target, you will be required to pay a withdrawal fee. To understand more about the withdrawal fee, view Tracer Documentation.
            </p>
        </div>
    )
})`
    height: 50px;
    overflow: hidden;
    transition: 0.3s ease-in-out;
    margin-left: -10px;
    margin-bottom: 2rem;
    border-radius: 5px;

    text-align: left;
    font-size: 16px;
    letter-spacing: -0.32px;

    &:hover {
        background: #03065E;
    }

    > .preview {
        justify-content: space-between;
        display: flex;
        padding: 10px;
        height: 50px;
        line-height: 30px;
    }
    &.open {
        background: #03065E;
        height: 200px;
    }

    > .drop-down {
        transition: 0.3s ease-in;
        opacity: 0
        height: 180px;
        overflow-y: scroll;
        min-width: 550px;
        width: 100%;
        padding: 0 10px;
        color: #fff;
    }

    &.open .drop-down {
        opacity: 1;
    }

`

type BProps = {
    type: 'Deposit' | 'Withdraw';
} & Children;
export const InsuranceButton: React.FC<BProps> = ({ type, children }: BProps) => {
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { poolInfo, deposit, withdraw } = useContext(InsuranceContext);
    const { handleTransaction } = useContext(TransactionContext);
    const [loading, setLoading] = useState(false);
    const [isDeposit, setIsDeposit] = useState(true);
    const tracerBalance = selectedTracer?.balances;

    useEffect(() => {
        if (type === 'Withdraw') {
            setIsDeposit(false)
        }
    }, [])

    const [showModal, setShowModal] = useState(false);
    const poolBalance = poolInfo?.userBalance ?? 0;
    const balance = type === 'Deposit' ? tracerBalance?.tokenBalance : poolBalance;
    const [valid, setValid] = useState(false);
    const [amount, setAmount] = useState(0); // The amount within the input

    const amount_ = !Number.isNaN(amount) ? amount : 0;
    const newBalance = type === 'Deposit' ? poolBalance + amount_ : poolBalance - amount_;

    useEffect(() => {
        setValid(amount > 0 && amount <= (balance ?? 0));
    }, [balance, amount]);

    const submit = async (amount: number) => {
        try {
            setLoading(true);
            const callback = () => {
                setLoading(false);
            };
            const t = isDeposit ? 'deposit' : 'withdraw'
            withdraw && deposit && handleTransaction
                ? handleTransaction(isDeposit ? deposit : withdraw, [amount], callback)
                : console.error(`Failed to ${t} from insurance pool: No deposit function found`);
        } catch (err) {
            console.error(`Failed to deposit into insurance pool: ${err}`);
        }
    };

    return (
        <>
            <TracerModal
                loading={loading}
                show={showModal}
                id="insurance-modal"
                onClose={() => setShowModal(false)}
                title={isDeposit ? 'Deposit Insurance' : 'Withdraw Insurance'}
                subTitle={
                    isDeposit
                        ? `Add insurance to the ${tracerId} insurance pool for a specified period of time.`
                        : `Withdraw from the ${tracerId} insurance pool`
                }
            >
                <div className="p-6 flex-auto">
                    <SSlideSelect
                        onClick={(index: number, _e: any) => setIsDeposit(index === 0)}
                        value={isDeposit ? 0 : 1}
                    >
                        <Option>
                            Deposit
                        </Option>
                        <Option>
                            Withdraw
                        </Option>
                    </SSlideSelect>
                    <SubTitle>{
                        isDeposit
                            ? `Deposit funds to the ${tracerId} insurance pool`
                            : `Withdraw funds from the ${tracerId} insurance pool`
                    }</SubTitle>
                    <DepositTerms isDeposit />
                    <NumberSelect
                        unit={tracerId?.split('/')[1] ?? 'NO_ID'}
                        title={'Amount'}
                        amount={amount}
                        balance={balance}
                        setAmount={setAmount}
                    />
                    <div className="">
                        <h3 className="mt-10 text-left text-blue-100 text-lg">Insurance Pool {type} Summary</h3>
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
                        {
                            !valid 
                                ? <Button onClick={() => submit(amount)}>
                                    {isDeposit ? 'Add Insurance' : 'Withdraw Insurance'}
                                </Button>
                                : <Button className="disabled">
                                    {isDeposit ? 'Add Insurance' : 'Withdraw Insurance'}
                                </Button>
                        }
                    </div>
                </div>
            </TracerModal>
            <div onClick={() => setShowModal(true)}>
                {children}
            </div>
        </>
    );
};

export const InsuranceButtons: React.FC = () => {
    return (
        <div className="mt-auto flex w-full">
            <InsuranceButton type="Deposit"></InsuranceButton>
            <InsuranceButton type="Withdraw">
                <div className="">
                    <h3 className="mt-10 text-left text-blue-100 text-lg">Insurance pool withdraw summary</h3>
                    <div>
                        <Section label={`My Shares`}>
                            {'  ->  '}
                            30 USDC
                        </Section>
                        <Section label={`Anticipated rewards`}>X% {'->'} X%</Section>
                    </div>
                </div>
            </InsuranceButton>
        </div>
    );
};
