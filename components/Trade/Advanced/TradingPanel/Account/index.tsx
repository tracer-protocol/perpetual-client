import React, { useContext, useState } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcBuyingPower, calcAvailableMarginPercent } from '@tracer-protocol/tracer-utils';
import { Box, Button, Previous } from '@components/General';
import { Web3Context } from 'context';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import AccountModal from './AccountModal';
import { LIMIT, OrderState } from '@context/OrderContext';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import { UserBalance } from 'types';
// import CalculatorModal from './Calculator';

const ConnectText = styled.div`
    font-size: var(--font-size-medium);
    color: var(--color-text);
`;

const ConnectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-small);
    border: 2px solid #fff;
    border-radius: 100px;
    width: 160px;
    height: 40px;
    transition: 0.2s;
    padding: 0 10px;
    margin-top: 10px;

    &:focus {
        outline: none;
    }

    &:hover {
        background: var(--color-primary);
    }
`;

const ConnectOverlay: React.FC = styled(({ className }) => {
    const { handleConnect } = useContext(Web3Context);
    return (
        <div className={className}>
            <ConnectText>No wallet connected.</ConnectText>
            <ConnectButton
                onClick={() => (handleConnect ? handleConnect() : console.error('Connect button is undefined'))}
            >
                Connect Wallet
            </ConnectButton>
        </div>
    );
})`
    display: flex;
    background-color: var(--color-background-secondary);
    opacity: 0.8;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    z-index: 3;
`;

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
    //background-color: ${(props) => (props.zeroBalance ? '#00125D' : 'inherit')};
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
    color: var(--color-secondary);
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
                        order.orderType === LIMIT ? new BigNumber(order.price) : fairPrice,
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
            <span>{calcAvailableMarginPercent(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(2)}%</span>
        );
    } else {
        return (
            <span>
                <Previous>
                    {`${calcAvailableMarginPercent(balances.quote, balances.base, fairPrice, maxLeverage).toFixed(2)}%`}
                </Previous>
                {`${calcAvailableMarginPercent(
                    order?.nextPosition.quote ?? balances.quote,
                    order?.nextPosition.base ?? balances.base,
                    order.orderType === LIMIT ? new BigNumber(order.price) : fairPrice,
                    maxLeverage,
                ).toFixed(2)}
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

    return (
        <div className="relative">
            <AccountInfo zeroBalance={balances.quote.eq(0)}>
                <Title>Margin Account</Title>
                {/*<SButton className="ml-auto mr-1" onClick={() => showCalculator(true)}>*/}
                {/*    Calculator*/}
                {/*</SButton>*/}
                <Item>
                    <h3>
                        <TooltipSelector tooltip={{ key: 'equity', props: { baseTicker: selectedTracer?.baseTicker } }}>
                            Equity
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
                            tooltip={{ key: 'buying-power', props: { baseTicker: selectedTracer?.baseTicker } }}
                        >
                            Buying Power
                        </TooltipSelector>
                        <SubText>{` @ ${maxLeverage.toNumber()}x Max Leverage`}</SubText>
                    </h3>
                    <BuyingPower order={order} balances={balances} maxLeverage={maxLeverage} fairPrice={fairPrice} />
                </Item>
                <Item>
                    <h3>
                        <TooltipSelector tooltip={{ key: 'available-margin' }}>Available Margin</TooltipSelector>
                    </h3>
                    <AvailableMargin
                        order={order}
                        balances={balances}
                        maxLeverage={maxLeverage}
                        fairPrice={fairPrice}
                    />
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
            {account === '' ? (
                <div className="absolute top-0 w-full h-full">
                    <ConnectOverlay />
                </div>
            ) : null}
        </div>
    );
};

export default AccountPanel;
