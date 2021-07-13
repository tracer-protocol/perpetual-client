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
import { UserBalance } from 'libs/types';
import ConnectOverlay from '@components/Overlay/ConnectOverlay';
// import CalculatorModal from './Calculator';

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
        letter-spacing: -0.32px;
    }

    > h3 {
        letter-spacing: -0.32px;
        color: var(--color-primary);
        display: inline-block;
        white-space: nowrap;
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
    flex-direction: column;
    overflow: auto;
`;

const Title = styled.h2<{
    hide: boolean;
}>`
    font-size: var(--font-size-small-heading);
    letter-spacing: -0.4px;
    color: var(--color-text);
    margin-bottom: 0.5rem;
    display: ${(props) => (props.hide ? 'none' : 'block')};
`;

const SButton = styled(Button)`
    height: 28px;
    line-height: 28px;
    padding: 0;
    margin: 0;
`;

const SubText = styled.div`
    letter-spacing: -0.32px;
    color: var(--color-secondary);
    font-size: var(--font-size-small);
    line-height: var(--font-size-small);
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
        <AccountInfo zeroBalance={balances.quote.eq(0)}>
            <Title hide={!!order?.exposureBN.toNumber() ?? false}>Margin Account</Title>
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
            {/*TODO: Add calculator*/}
            {/*<CalculatorModal*/}
            {/*    display={calculator}*/}
            {/*    close={() => showCalculator(false)}*/}
            {/*    exposureUnit={selectedTracer?.marketId?.split('/')[0] ?? 'NO_ID'}*/}
            {/*    marginUnit={selectedTracer?.marketId?.split('/')[1] ?? 'NO_ID'}*/}
            {/*    balances={balances}*/}
            {/*    price={Number.isNaN(price) ? 0 : price}*/}
            {/*/>*/}
            {account === '' ? <ConnectOverlay /> : null}
        </AccountInfo>
    );
};

export default AccountPanel;
