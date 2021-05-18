import React, { useContext, useState, useEffect } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcMinimumMargin } from '@tracer-protocol/tracer-utils';
import { After, Box, Button, Close, HiddenExpand, Previous } from '@components/General';
import { Web3Context } from '@components/context';
import NumberSelect from '@components/Input/NumberSelect';
import { Section } from '@components/SummaryInfo';
import { UserBalance } from '@components/types';
import Error from '@components/Trade/Error';

const MinHeight = 250;

const SBox = styled(Box)`
    background: #011772;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    min-height: ${MinHeight}px;
    > p {
        font-size: 20px;
        letter-spacing: 0;
        color: #fff;
    }
`;

const Connect = styled(Button)`
    width: 100%;
    padding: 0.5rem;
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
    min-height: ${MinHeight}px;
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
    &: after {
        margin: auto;
    }
`;
const MButton = styled(Button)`
    width: 100%;
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

type PProps = {
    className?: string;
    close: (e: any) => any;
    deposit: boolean;
    display: boolean;
    unit: string;
    balances: UserBalance;
    price: number;
    maxLeverage: number;
};

const Popup: React.FC<PProps> = styled(({ className, close, deposit, unit, balances, price, maxLeverage }: PProps) => {
    const [amount, setAmount] = useState(0);
    const available = deposit
        ? balances.tokenBalance
        : balances.quote - calcMinimumMargin(balances.base, balances.quote, price, maxLeverage);
    const newBalance = deposit ? balances.quote + amount : balances.quote - amount;
    const invalid = amount > available;
    return (
        <div className={className}>
            <div className="header">
                <p>{deposit ? 'Deposit' : 'Withdraw'} Margin</p>
                <Close onClick={close} />
            </div>
            <SNumberSelect unit={unit} title={'Amount'} amount={amount} balance={available} setAmount={setAmount} />
            <Balance display={!!amount}>
                <span className="mr-3">Balance</span>
                <SAfter className={invalid ? 'invalid' : ''}>{toApproxCurrency(newBalance)}</SAfter>
            </Balance>
            <SHiddenExpand defaultHeight={0} open={!!amount}>
                <p className="mb-3">{deposit ? 'Deposit' : 'Withdraw'} Summary</p>
                <SSection label={`Total Margin`}>
                    <SPrevious>{`${toApproxCurrency(
                        calcTotalMargin(balances.base, balances.quote, price),
                    )}`}</SPrevious>
                    {`${toApproxCurrency(calcTotalMargin(balances.base, newBalance, price))}`}
                </SSection>
                <SSection label={`Maintenance Margin`}>
                    <SPrevious>{`${toApproxCurrency(
                        calcMinimumMargin(balances.base, balances.quote, price, maxLeverage),
                    )}`}</SPrevious>
                    {`${toApproxCurrency(calcMinimumMargin(balances.base, newBalance, price, maxLeverage))}`}
                </SSection>
            </SHiddenExpand>
            <MButton>{deposit ? 'Deposit' : 'Withdraw'}</MButton>
            <Error error={invalid ? 5 : -1} />
        </div>
    );
})`
    transition: 0.3s;
    position: absolute;
    padding: 10px;
    top: 0;
    left: 0;
    min-height: 100%;
    width: 100%;
    background: #011772;
    z-index: ${(props) => (props.display ? '10' : '-1')};
    opacity: ${(props) => (props.display ? '1' : '0')};

    > .header {
        color: #fff;
        line-height: 20px;
        font-size: 20px;
        letter-spacing: -0.4px;
        display: flex;
        justify-content: space-between;
    }
`;

export const AccountPanel: React.FC<{
    selectedTracer: Tracer | undefined;
    account: string;
}> = ({ selectedTracer, account }) => {
    const [popup, setPopup] = useState(false);
    const [deposit, setDeposit] = useState(false);
    const balances = selectedTracer?.balances ?? {
        quote: 0,
        base: 0,
        totalLeveragedValue: 0,
        lastUpdatedGasPrice: 0,
        tokenBalance: 0,
    };
    // console.log(selectedTracer?.oraclePrice, selectedTracer?.priceMultiplier)
    const fairPrice = (selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 1);
    const maxLeverage = selectedTracer?.maxLeverage ?? 1;

    useEffect(() => {
        const overlay = document.getElementById('trading-overlay');
        if (overlay) {
            popup ? overlay.classList.add('display') : overlay.classList.remove('display');
        }
    }, [popup]);

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
                    <a>{toApproxCurrency(calcTotalMargin(balances?.base ?? 0, balances?.quote ?? 0, fairPrice))}</a>
                </span>
            </Item>
            <Item>
                <h3>Minimum Margin</h3>
                <span>
                    <a>
                        {toApproxCurrency(
                            calcMinimumMargin(balances?.base ?? 0, balances?.quote ?? 0, fairPrice, maxLeverage),
                        )}
                    </a>
                </span>
            </Item>
            <DepositButtons>
                <Button className="w-full mr-2" onClick={(_e: any) => handleClick(true, true)}>
                    Deposit
                </Button>
                <Button className="w-full ml-2" onClick={(_e: any) => handleClick(true, false)}>
                    Withdraw
                </Button>
            </DepositButtons>
            <Popup
                display={popup}
                close={(_e: any) => setPopup(false)}
                deposit={deposit}
                unit={selectedTracer?.marketId?.split('/')[1] ?? 'NO_ID'}
                balances={balances}
                maxLeverage={maxLeverage}
                price={Number.isNaN(fairPrice) ? 0 : fairPrice}
            />
        </AccountInfo>
    );
};
