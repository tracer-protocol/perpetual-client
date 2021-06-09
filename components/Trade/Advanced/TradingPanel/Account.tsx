import React, { useContext, useState, useCallback } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcMinimumMargin } from '@tracer-protocol/tracer-utils';
import { After, Box, Button, HiddenExpand, Previous } from '@components/General';
import { TracerContext, Web3Context } from 'context';
import { NumberSelect, Section } from '@components/General';
import { UserBalance } from 'types';
import Error from '@components/Trade/Error';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import TracerModal from '@components/Modals';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';

const MinHeight = 250;

const SBox = styled(Box)`
    background: #011772;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: ${MinHeight}px;
    z-index: 4;

    > p {
        font-size: 20px;
        letter-spacing: 0;
        color: #fff;
    }
`;

const Connect = styled(Button)`
    width: 100% !important;
    padding: 0.5rem !important;
    margin-top: 0.5rem;
`;

const WalletConnect: React.FC = () => {
    const { handleConnect } = useContext(Web3Context);
    return (
        <SBox>
            <p>Connect your wallet to get started with Tracer</p>
            <Connect
                className="primary"
                onClick={() => (handleConnect ? handleConnect() : console.error('Connect button is undefined'))}
            >
                Connect Wallet
            </Connect>
        </SBox>
    );
};

const Item = styled.div`
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;

    span {
        width: 100%;
        display: flex;
        font-size: 16px;
        letter-spacing: -0.32px;
    }

    > span a:nth-child(2) {
        margin-left: auto;
        color: #21dd53;
    }

    h3 {
        letter-spacing: -0.32px;
        color: #3da8f5;
        text-transform: capitalize;
        margin-bottom: 5px;
    }
`;

const DepositButtons = styled.div`
    margin-top: auto;
    display: flex;
    justify-content: space-between;
`;

const AccountInfo = styled(Box)`
    position: relative;
    flex-direction: column;
`;

const SNumberSelect = styled(NumberSelect)`
    margin-top: 1rem;
    > * .balance {
        color: #3da8f5;
        margin-left: 2rem;
    }
    > * .balance > .max {
        margin-left: 2rem;
    }
`;

const SHiddenExpand = styled(HiddenExpand)`
    margin-left: 0;
    background: #002886;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const SSection = styled(Section)`
    flex-direction: column;
    margin-top: 0.5rem;
    margin-bottom: 0;
    > .content {
        display: flex;
        justify-content: space-between;
        padding: 0;
    }
`;

const SPrevious = styled(Previous)`
    width: 100%;
    display: flex;
    &:after {
        margin: auto;
    }
`;
const MButton = styled(Button)`
    width: 80%;
    margin: auto;
    height: 40px;
    border: 1px solid #ffffff;
    color: #fff;
`;

const Balance = styled.div<{
    display: boolean;
}>`
    color: #3da8f5;
    font-size: 1rem;
    letter-spacing: -0.32px;
    transition: 0.3s;
    opacity: ${(props) => (props.display ? 1 : 0)};
`;

const SAfter = styled(After)`
    &.invalid {
        color: #f15025;
    }
`;

const SSlideSelect = styled(SlideSelect)`
    max-width: 250px;
    margin-left: 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const SButton = styled(Button)`
    height: 28px;
    line-height: 28px;
    padding: 0;
`;

type AMProps = {
    className?: string;
    close: () => any;
    isDeposit: boolean;
    setDeposit: React.Dispatch<React.SetStateAction<boolean>>;
    display: boolean;
    unit: string;
    balances: UserBalance;
    price: BigNumber;
    maxLeverage: BigNumber;
};

const AccountModal: React.FC<AMProps> = styled(
    ({ className, close, isDeposit, unit, balances, price, maxLeverage, display, setDeposit }: AMProps) => {
        const {
            deposit = () => console.error('Deposit is not defined'),
            withdraw = () => console.error('Withdraw is not defined'),
        } = useContext(TracerContext);
        const [amount, setAmount] = useState(NaN);
        const available = isDeposit
            ? balances.tokenBalance
            : calcTotalMargin(balances.quote, balances.base, price).minus(
                  calcMinimumMargin(balances.quote, balances.base, price, maxLeverage),
              );
        const newBalance = isDeposit ? balances.quote.plus(amount) : balances.quote.minus(amount);
        const checkErrors = useCallback(() => {
            if (amount > available.toNumber()) {
                return 5;
            } else if (
                amount < calcMinimumMargin(balances.quote, balances.base, price, maxLeverage).toNumber() ||
                // TODO remove 160 for dynamic calculation of liquidation gas cost
                amount < 160 - calcTotalMargin(balances.quote, balances.base, price).toNumber()
            ) {
                return 6;
            }
            return -1;
        }, [amount]);
        return (
            <TracerModal
                loading={false}
                className={className}
                show={display}
                title={`${isDeposit ? 'Deposit' : 'Withdraw'} Margin`}
                onClose={close}
            >
                <SSlideSelect value={isDeposit ? 0 : 1} onClick={(val) => setDeposit(val === 0)}>
                    <Option>Deposit</Option>
                    <Option>Withdraw</Option>
                </SSlideSelect>
                <SNumberSelect
                    unit={unit}
                    title={'Amount'}
                    amount={amount}
                    balance={available.toNumber()}
                    setAmount={setAmount}
                />
                <Balance display={!!amount}>
                    <span className="mr-3">Balance</span>
                    <SAfter className={checkErrors() !== -1 ? 'invalid' : ''}>{toApproxCurrency(newBalance)}</SAfter>
                </Balance>
                <SHiddenExpand defaultHeight={0} open={!!amount}>
                    <p className="mb-3">{isDeposit ? 'Deposit' : 'Withdraw'} Summary</p>
                    <SSection
                        label={`Total Margin`}
                        tooltip={'This can be thought of as total equity or total account value'}
                    >
                        <SPrevious>{`${toApproxCurrency(
                            calcTotalMargin(balances.quote, balances.base, price),
                        )}`}</SPrevious>
                        {`${toApproxCurrency(calcTotalMargin(newBalance, balances.base, price))}`}
                    </SSection>
                    <SSection label={`Maintenance Margin`}>
                        <SPrevious>{`${toApproxCurrency(
                            calcMinimumMargin(balances.quote, balances.base, price, maxLeverage),
                        )}`}</SPrevious>
                        {`${toApproxCurrency(calcMinimumMargin(newBalance, balances.base, price, maxLeverage))}`}
                    </SSection>
                </SHiddenExpand>
                <MButton onClick={() => (isDeposit ? deposit(amount, close) : withdraw(amount, close))}>
                    {isDeposit ? 'Deposit' : 'Withdraw'}
                </MButton>
                <Error error={checkErrors()} />
            </TracerModal>
        );
    },
)`
    max-width: 434px;

    .content {
        width: 434px;
    }
`;

const AccountPanel: React.FC<{
    selectedTracer: Tracer | undefined;
    account: string;
}> = ({ selectedTracer, account }) => {
    const [popup, setPopup] = useState(false);
    const [deposit, setDeposit] = useState(false);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const fairPrice = selectedTracer?.oraclePrice ?? defaults.oraclePrice;
    const maxLeverage = selectedTracer?.maxLeverage ?? new BigNumber(1);

    const handleClick = (popup: boolean, deposit: boolean) => {
        setPopup(popup);
        setDeposit(deposit);
    };

    return account === '' ? (
        <WalletConnect />
    ) : (
        <AccountInfo>
            <Item>
                <h3>Total Margin</h3>
                <span>
                    <a>{toApproxCurrency(calcTotalMargin(balances.quote, balances.base, fairPrice))}</a>
                </span>
            </Item>
            <Item>
                <h3>Minimum Margin</h3>
                <span>
                    <a>{toApproxCurrency(calcMinimumMargin(balances.quote, balances.base, fairPrice, maxLeverage))}</a>
                </span>
            </Item>
            <DepositButtons>
                <SButton onClick={(_e: any) => handleClick(true, true)}>Deposit</SButton>
                <SButton onClick={(_e: any) => handleClick(true, false)}>Withdraw</SButton>
            </DepositButtons>
            <AccountModal
                display={popup}
                close={() => setPopup(false)}
                isDeposit={deposit}
                setDeposit={setDeposit}
                unit={selectedTracer?.marketId?.split('/')[1] ?? 'NO_ID'}
                balances={balances}
                maxLeverage={maxLeverage}
                price={Number.isNaN(fairPrice) ? 0 : fairPrice}
            />
        </AccountInfo>
    );
};

export default AccountPanel;
