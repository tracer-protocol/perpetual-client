import React, { useState } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcBuyingPower, calcAvailableMarginPercent } from '@tracer-protocol/tracer-utils';
import { Box, Button, Previous } from '@components/General';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import AccountModal from './AccountModal';
import { LIMIT, OrderState } from '@context/OrderContext';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import CalculatorModal from './Calculator';
import { CalculatorStore } from '@context/CalculatorContext';
import { UserBalance } from 'libs/types';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';

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

const DepositButtons = styled.div<{
    hide: boolean;
}>`
    margin-top: 10px;
    justify-content: space-between;
    display: ${(props) => (props.hide ? 'none' : 'flex')};
`;

const AccountInfo = styled(Box)<{ zeroBalance: boolean }>`
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    overflow: auto;
`;

const Title = styled.h2<{
    hide: boolean;
}>`
    font-size: var(--font-size-medium);
    letter-spacing: -0.4px;
    color: var(--color-text);
    margin-bottom: 0.5rem;
    white-space: nowrap;
    display: ${(props) => (props.hide ? 'none' : 'flex')};
`;

const SButton = styled(Button)`
    height: var(--height-small-button);
    line-height: var(--height-small-button);
    padding: 0;
    margin: 0;
`;
const CalculatorButton = styled(Button)`
    height: var(--height-extra-small-button);
    line-height: var(--height-extra-small-button);
    padding: 0 1rem;
    margin-left: auto;
    margin-right: 0;
    width: auto;
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
    const [calculator, showCalculator] = useState(false);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const fairPrice = selectedTracer?.getFairPrice() ?? defaults.fairPrice;
    const maxLeverage = selectedTracer?.getMaxLeverage() ?? new BigNumber(1);

    const handleClick = (popup: boolean, deposit: boolean) => {
        setPopup(popup);
        setDeposit(deposit);
    };

    return (
        <AccountInfo zeroBalance={balances.quote.eq(0)}>
            <Title hide={!!order?.exposureBN.toNumber() ?? false}>
                Margin Account
                <CalculatorButton onClick={() => showCalculator(true)}>Calculator</CalculatorButton>
            </Title>
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
            <Item className="mb-0">
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
            <DepositButtons hide={!!order?.exposureBN?.toNumber() ?? false}>
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
            <CalculatorStore>
                <CalculatorModal
                    display={calculator}
                    close={() => showCalculator(false)}
                    baseTicker={selectedTracer?.baseTicker ?? 'NO_ID'}
                    quoteTicker={selectedTracer?.quoteTicker ?? 'NO_ID'}
                    balances={balances}
                    fairPrice={fairPrice}
                />
            </CalculatorStore>
            {account === '' ? <ConnectOverlay /> : null}
        </AccountInfo>
    );
};

export default AccountPanel;
