import React, { useContext, useState } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcMinimumMargin } from '@tracer-protocol/tracer-utils';
import { Box, Button } from '@components/General';
import { Web3Context } from 'context';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import AccountModal from './AccountModal';

const SBox = styled(Box)`
    background: #011772;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 250px;
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

const SButton = styled(Button)`
    height: 28px;
    line-height: 28px;
    padding: 0;
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
                <div className="flex">
                    <h3>Total Margin</h3>
                    {/*<SButton className="ml-auto mr-1" onClick={() => showCalculator(true)}>*/}
                    {/*    Calculator*/}
                    {/*</SButton>*/}
                </div>
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
            {/* <CalculatorModal
                display={calculator}
                close={() => showCalculator(false)}
                exposureUnit={selectedTracer?.marketId?.split('/')[0] ?? 'NO_ID'}
                marginUnit={selectedTracer?.marketId?.split('/')[1] ?? 'NO_ID'}
                balances={balances}
                price={Number.isNaN(fairPrice) ? 0 : fairPrice}
            /> */}
        </AccountInfo>
    );
};

export default AccountPanel;
