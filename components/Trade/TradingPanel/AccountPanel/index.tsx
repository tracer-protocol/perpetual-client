import React, { FC, useState } from 'react';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcBuyingPower, calcAvailableMarginPercent } from '@tracer-protocol/tracer-utils';
import { Box, Button, Previous } from '@components/General';
import { BigNumber } from 'bignumber.js';
import Tracer, { defaults } from '@libs/Tracer';
import AccountModal from '../../../General/TracerModal/AccountModal';
import { OrderState } from '@context/OrderContext';
import { LIMIT } from '@libs/types/OrderTypes';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import { UserBalance } from '@libs/types';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
import { CalculatorStore } from '@context/CalculatorContext';
import CalculatorModal from '@components/General/TracerModal/CalculatorModal';

type InfoProps = {
    order: OrderState | undefined;
    balances: UserBalance;
    maxLeverage: BigNumber;
    fairPrice: BigNumber;
};
const BuyingPower: FC<InfoProps> = ({ order, balances, maxLeverage, fairPrice }: InfoProps) => {
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

export const AvailableMargin: FC<InfoProps> = ({ order, balances, maxLeverage, fairPrice }: InfoProps) => {
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

interface APProps {
    selectedTracer: Tracer | undefined;
    account: string;
    order: OrderState | undefined;
}
const AccountPanel: FC<APProps> = ({ selectedTracer, account, order }: APProps) => {
    const [popup, setPopup] = useState(false);
    const [deposit, setDeposit] = useState(false);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const fairPrice = selectedTracer?.getFairPrice() ?? defaults.fairPrice;
    const maxLeverage = selectedTracer?.getMaxLeverage() ?? new BigNumber(1);
    const [showCalculator, setShowCalculator] = useState(false);

    const openModal = (isDeposit: boolean) => {
        setPopup(true);
        setDeposit(isDeposit);
    };

    return (
        <AccountInfo zeroBalance={balances.quote.eq(0)}>
            <Title hide={!!order?.exposureBN.toNumber() ?? false}>
                <span>Margin Account</span>
                <Button id="calculator-button" onClick={() => setShowCalculator(true)}>
                    Calculator
                </Button>
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
                </h3>
                <span>
                    <BuyingPower order={order} balances={balances} maxLeverage={maxLeverage} fairPrice={fairPrice} />
                    <SubText>{` @ ${maxLeverage.toNumber()}x Max Leverage`}</SubText>
                </span>
            </Item>
            <Item className="mb-0">
                <h3>
                    <TooltipSelector tooltip={{ key: 'available-margin' }}>Available Margin</TooltipSelector>
                </h3>
                <AvailableMargin order={order} balances={balances} maxLeverage={maxLeverage} fairPrice={fairPrice} />
            </Item>
            <DepositWithdraw>
                <Button
                    className={balances.quote.eq(0) ? 'primary' : ''}
                    onClick={(_e: any) => openModal(true)}
                    id="deposit-button"
                >
                    Deposit
                </Button>
                <Button onClick={(_e: any) => openModal(false)} id="withdraw-button">
                    Withdraw
                </Button>
            </DepositWithdraw>
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
                    display={showCalculator}
                    close={() => setShowCalculator(false)}
                    baseTicker={selectedTracer?.baseTicker ?? 'NO_ID'}
                    quoteTicker={selectedTracer?.quoteTicker ?? 'NO_ID'}
                    balances={balances}
                    fairPrice={fairPrice}
                />
            </CalculatorStore>
            {!account ? <ConnectOverlay /> : null}
        </AccountInfo>
    );
};

export default AccountPanel;

const NoBalance = styled.span`
    color: var(--color-primary);
`;

const Item = styled.div`
    width: 100%;
    font-size: var(--font-size-small);
    margin-bottom: 10px;
    display: flex;

    > span {
        margin-left: auto;
        text-align: right;
        font-size: var(--font-size-small);
        letter-spacing: var(--letter-spacing-small);
    }

    > h3 {
        letter-spacing: var(--letter-spacing-small);
        color: var(--color-primary);
        display: inline-block;
        white-space: nowrap;
        text-transform: capitalize;
    }
`;

const DepositWithdraw = styled.div`
    display: flex;
    margin-top: 1rem;
    justify-content: space-between;
`;

const AccountInfo = styled(Box)<{ zeroBalance: boolean }>`
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    overflow: auto;
    min-height: 80px;
`;

const Title = styled.div<{ hide: boolean }>`
    margin-bottom: 0.5rem;
    white-space: nowrap;
    display: ${(props) => (props.hide ? 'none' : 'flex')};
    justify-content: space-between;

    > span {
        font-size: var(--font-size-small-heading);
        font-weight: bold;
        letter-spacing: var(--letter-spacing-extra-small);
        color: var(--color-text);
    }
`;

const SubText = styled.div`
    letter-spacing: var(--letter-spacing-small);
    color: var(--color-secondary);
    font-size: var(--font-size-small);
    line-height: var(--font-size-small);
`;
