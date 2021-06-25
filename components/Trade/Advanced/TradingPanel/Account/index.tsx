import React, { useContext, useState } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import {
    calcTotalMargin,
    calcBuyingPower,
    calcMinimumMargin,
    calcAvailableMarginPercent,
} from '@tracer-protocol/tracer-utils';
import { Box, Button, Previous } from '@components/General';
import { Web3Context } from 'context';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import AccountModal from './AccountModal';
import { OrderState } from '@context/OrderContext';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import { UserBalance } from 'types';
// import CalculatorModal from './Calculator';

const SBox = styled(Box)`
    background: #011772;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 250px;
    z-index: 4;

    > p {
        font-size: var(--font-size-medium);
        letter-spacing: 0;
        color: var(--color-text);
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

const NoBalance = styled.span`
    color: var(--color-primary);
`;

const Item = styled.div`
    width: 100%;
    font-size: var(--font-size-small);
    margin-bottom: 10px;

    > span {
        width: 100%;
        display: flex;
        font-size: var(--font-size-small);
        letter-spacing: -0.32px;
    }

    > span a:nth-child(2) {
        margin-left: auto;
        color: #21dd53;
    }

    > h3 {
        letter-spacing: -0.32px;
        color: var(--color-primary);
        text-transform: capitalize;
        margin-bottom: 5px;
    }
`;

const DepositButtons = styled.div`
    margin-top: auto;
    display: flex;
    justify-content: space-between;
`;

const AccountInfo = styled(Box)<{ zeroBalance: boolean }>`
    position: relative;
    flex-direction: column;
    background-color: ${(props) => (props.zeroBalance ? '#00125D' : 'inherit')};
`;

const Title = styled.h2`
    font-size: var(--font-size-medium);
    letter-spacing: -0.4px;
    color: var(--color-text);
    margin-bottom: 0.5rem;
`;

const SButton = styled(Button)`
    height: 28px;
    line-height: 28px;
    padding: 0;
    margin: 0;
`;

const SubText = styled.span`
    letter-spacing: -0.32px;
    color: #005ea4;
    font-size: var(--font-size-small);
    display: inline !important;
`;

type InfoProps = {
    order: OrderState | undefined;
    balances: UserBalance;
    maxLeverage: BigNumber;
    fairPrice: BigNumber;
};
const BuyingPower: React.FC<InfoProps> = ({ order, balances, maxLeverage, fairPrice }) => {
    if (balances.quote.eq(0)) {
        return <NoBalance>-</NoBalance>;
    } else if (!order?.exposure || !order.price) {
        return <span>{toApproxCurrency(calcBuyingPower(balances.quote, balances.base, fairPrice, maxLeverage))}</span>;
    } else {
        return (
            <span>
                <Previous>
                    {toApproxCurrency(calcBuyingPower(balances.quote, balances.base, fairPrice, maxLeverage))}
                </Previous>
                {toApproxCurrency(
                    calcBuyingPower(
                        order?.nextPosition.quote ?? balances.quote,
                        order?.nextPosition.base ?? balances.base,
                        new BigNumber(order.price),
                        maxLeverage,
                    ),
                )}
            </span>
        );
    }
};
const AvailableMargin: React.FC<InfoProps> = ({ order, balances, maxLeverage, fairPrice }) => {
    if (balances.quote.eq(0)) {
        return <NoBalance>-</NoBalance>;
    } else if (!order?.exposure || !order.price) {
        return (
            <span>
                ${calcAvailableMarginPercent(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(3)}%
            </span>
        );
    } else {
        return (
            <span>
                <Previous>
                    {`${calcAvailableMarginPercent(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(3)}%`}
                </Previous>
                {`${calcAvailableMarginPercent(
                    order?.nextPosition.quote ?? balances.quote,
                    order?.nextPosition.base ?? balances.base,
                    new BigNumber(order.price),
                    maxLeverage,
                ).toFixed(3)}
                %`}
            </span>
        );
    }
};

const AccountPanel: React.FC<{
    selectedTracer: Tracer | undefined;
    account: string;
    order: OrderState | undefined;
}> = ({ selectedTracer, account, order }) => {
    const [popup, setPopup] = useState(false);
    const [deposit, setDeposit] = useState(false);
    // const [calculator, showCalculator] = useState(false);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const fairPrice = selectedTracer?.getFairPrice() ?? defaults.fairPrice;
    const maxLeverage = selectedTracer?.getMaxLeverage() ?? new BigNumber(1);

    const handleClick = (popup: boolean, deposit: boolean) => {
        setPopup(popup);
        setDeposit(deposit);
    };

    if (account === '') {
        return <WalletConnect />;
    }
    return (
        <AccountInfo zeroBalance={balances.quote.eq(0)}>
            <Title>Margin Account</Title>
            {/*<SButton className="ml-auto mr-1" onClick={() => showCalculator(true)}>*/}
            {/*    Calculator*/}
            {/*</SButton>*/}
            <Item>
                <h3>
                    <TooltipSelector
                        tooltip={{ key: 'total-margin', props: { baseTicker: selectedTracer?.baseTicker ?? '' } }}
                    >
                        Total Margin
                    </TooltipSelector>
                </h3>
                {balances.quote.eq(0) ? (
                    <NoBalance>-</NoBalance>
                ) : (
                    <span>{toApproxCurrency(calcTotalMargin(balances.quote, balances.base, fairPrice))}</span>
                )}
            </Item>
            <Item>
                <h3>
                    <TooltipSelector
                        tooltip={{
                            key: 'buying-power',
                            props: {
                                baseTicker: selectedTracer?.baseTicker ?? '',
                                availableMargin:
                                    balances.totalMargin.toNumber() -
                                        calcMinimumMargin(
                                            balances.quote,
                                            balances.base,
                                            fairPrice,
                                            maxLeverage,
                                        ).toNumber() ?? 0,
                                maxLeverage: maxLeverage.toNumber() ?? 0,
                            },
                        }}
                    >
                        Buying Power
                    </TooltipSelector>
                    <SubText>{` @${maxLeverage.toNumber()}X Maximum Leverage`}</SubText>
                </h3>
                <BuyingPower order={order} balances={balances} maxLeverage={maxLeverage} fairPrice={fairPrice} />
            </Item>
            <Item>
                <h3>
                    <TooltipSelector tooltip={{ key: 'available-margin' }}>Available Margin</TooltipSelector>
                </h3>
                <AvailableMargin order={order} balances={balances} maxLeverage={maxLeverage} fairPrice={fairPrice} />
            </Item>
            <DepositButtons>
                <SButton
                    className={balances.quote.eq(0) ? 'primary' : ''}
                    onClick={(_e: any) => handleClick(true, true)}
                >
                    Deposit
                </SButton>
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
                fairPrice={fairPrice}
            />
            {/*TODO: Add calculator*/}
            {/*<CalculatorModal*/}
            {/*    display={calculator}*/}
            {/*    close={() => showCalculator(false)}*/}
            {/*    exposureUnit={selectedTracer?.marketId?.split('/')[0] ?? 'NO_ID'}*/}
            {/*    marginUnit={selectedTracer?.marketId?.split('/')[1] ?? 'NO_ID'}*/}
            {/*    balances={balances}*/}
            {/*    price={Number.isNaN(price) ? 0 : price}*/}
            {/*/>*/}
        </AccountInfo>
    );
};

export default AccountPanel;
