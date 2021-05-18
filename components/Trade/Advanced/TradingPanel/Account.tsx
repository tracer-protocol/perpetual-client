import React, { useContext } from "react";
import { Tracer } from "libs";
import { toApproxCurrency, totalMargin, calcMinimumMargin } from "@libs/utils";
import styled from "styled-components";
import { Box, Button } from '@components/General';
import { Web3Context } from "@components/context";

const MinHeight = 280;

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
`

const SButton = styled(Button)`
    width: 100%;
    padding: 0.3rem;
    margin-top: 0.5rem;
`

const WalletConnect: React.FC = () => {
    const { handleConnect } = useContext(Web3Context);
    return (
        <SBox>
            <p>Connect your wallet to get started with Tracer</p>
            <SButton className="primary"  onClick={() => handleConnect ? handleConnect() : console.error("Connect button is undefined")}>
                Connect Wallet
            </SButton>
        </SBox>
    ) 
}

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
    display: flex;
    justify-content: space-between;
`;

const AccountInfo = styled(Box)`
    min-height: ${MinHeight}px;
    flex-direction: column;
`

export const AccountPanel: React.FC<{
    selectedTracer: Tracer | undefined;
    account: string;
}> = ({ selectedTracer, account }) => {
    const balances = selectedTracer?.balances;
    const fairPrice = (selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0);
    const maxLeverage = selectedTracer?.maxLeverage ?? 1;

    return account === '' ? (
        <WalletConnect />
    ) : (
        <AccountInfo>
            <Item>
                <h3>Total Margin</h3>
                <span>
                    <a>{toApproxCurrency(totalMargin(balances?.base ?? 0, balances?.quote ?? 0, fairPrice))}</a>
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
                <Button className="primary">Deposit</Button>
                <Button>Withdraw</Button>
            </DepositButtons>
        </AccountInfo>
    );
};