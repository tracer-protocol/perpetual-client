import React, { useContext, useState, useEffect } from 'react';
import { Tracer } from 'libs';
import { toApproxCurrency } from '@libs/utils';
import styled from 'styled-components';
import { calcTotalMargin, calcMinimumMargin, calcLeverage, calcLiquidationPrice } from '@tracer-protocol/tracer-utils';
import { Box, Button } from '@components/General';
import { Web3Context, TracerContext } from 'context';
import { BigNumber } from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import AccountModal from './AccountModal';
import DefaultSlider from '@components/Slider';
import { UserBalance } from 'types';
import { SlideSelect } from '@components/Buttons';
import TracerModal from '@components/Modals';
import { NumberSelect } from '@components/General';
import { Option } from '@components/Buttons/SlideSelect';

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

const CalcSelectContainer = styled.div`
    margin-top: 1rem;
    border-top: 1px solid #002886;
`;

const CalcSlideSelect = styled(SlideSelect)`
    max-width: 300px;
    margin: 1rem auto;
`;

const CalcButtons = styled.div`
    margin: 3rem 5rem;
    display: flex;
    justify-content: space-around;
`;

const AccountNumberSelect = styled(NumberSelect)`
    margin-top: 1rem;
    > * .balance {
        color: #3da8f5;
        margin-left: 2rem;
    }
    > * .balance > .max {
        margin-left: 2rem;
    }
`;

type LProps = {
    className?: string;
    value?: number;
    handleChange?: (val: number) => any;
};
const Leverage: React.FC<LProps> = styled(({ className, value, handleChange }: LProps) => {
    return (
        <div className={className}>
            <h3>Leverage</h3>
            <DefaultSlider className="px-5" value={value} handleChange={handleChange} />
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    margin-bottom: 4rem;

    > h3 {
        font-size: 1rem;
        color: #3da8f5;
        margin-bottom: 1rem;
    }
`;

type CalculatorModalProps = {
    className?: string;
    close: () => any;
    display: boolean;
    exposureUnit: string;
    marginUnit: string;
    balances: UserBalance;
    price: BigNumber;
};
const CalculatorModal: React.FC<CalculatorModalProps> = styled(
    ({ className, close, exposureUnit, marginUnit, balances, display }: CalculatorModalProps) => {
        const { selectedTracer } = useContext(TracerContext);
        const [leverage, setLeverage] = useState(1);
        const [exposureAmount, setExposureAmount] = useState(NaN);
        const [marginAmount, setMarginAmount] = useState(NaN);
        const [liquidationAmount, setLiquidationAmount] = useState(NaN);

        const [isLong, setPosition] = useState(true);
        const [showResult, setShowResult] = useState(false);

        const [exposureLocked, setExposureLocked] = useState(false);
        const [marginLocked, setMarginLocked] = useState(false);

        useEffect(() => {
            setLeverage(leverage);
        }, [leverage]);

        const Calculate = () => {
            if (isLong) {
                setLiquidationAmount(
                    calcLiquidationPrice(
                        new BigNumber(marginAmount).negated(),
                        new BigNumber(exposureAmount),
                        new BigNumber(1),
                        new BigNumber(25),
                    ).toNumber(),
                );
            } else {
                setLiquidationAmount(
                    calcLiquidationPrice(
                        new BigNumber(marginAmount).negated(),
                        new BigNumber(-Math.abs(exposureAmount)),
                        new BigNumber(1),
                        new BigNumber(25),
                    ).toNumber(),
                );
            }
            setShowResult(true);
        };

        const Reset = () => {
            setExposureAmount(NaN);
            setMarginAmount(NaN);
            setLiquidationAmount(NaN);
            setShowResult(false);

            setExposureLocked(false);
            setMarginLocked(false);
        };

        const ChangeExposure = (e: any) => {
            setExposureAmount(Math.abs(parseFloat(e.target.value)));
            setShowResult(false);
        };

        const ChangeMargin = (e: any) => {
            setMarginAmount(Math.abs(parseFloat(e.target.value)));
            setShowResult(false);
        };

        const ChangeLiquidation = (e: any) => {
            setLiquidationAmount(Math.abs(parseFloat(e.target.value)));
            setShowResult(false);
        };

        return (
            <TracerModal
                loading={false}
                className={className}
                show={display}
                title={`${selectedTracer?.marketId} Calculator`}
                onClose={close}
            >
                <CalcSelectContainer>
                    <CalcSlideSelect value={isLong ? 0 : 1} onClick={() => setPosition(!isLong)}>
                        <Option>Long</Option>
                        <Option>Short</Option>
                    </CalcSlideSelect>
                </CalcSelectContainer>

                <AccountNumberSelect
                    unit={exposureUnit}
                    title={'Exposure'}
                    amount={exposureAmount}
                    setAmount={setExposureAmount}
                    onChange={ChangeExposure}
                    hasLock={true}
                    isLocked={exposureLocked}
                    lockOnClick={() => setExposureLocked(!exposureLocked)}
                />

                <AccountNumberSelect
                    unit={marginUnit}
                    title={'Margin'}
                    amount={marginAmount}
                    balance={balances.tokenBalance.toNumber()}
                    setAmount={setMarginAmount}
                    onChange={ChangeMargin}
                    hasLock={true}
                    isLocked={marginLocked}
                    lockOnClick={() => setMarginLocked(!marginLocked)}
                />

                <Leverage value={leverage} handleChange={(val) => setLeverage(val)} />
                <input value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} />

                <div>
                    Leverage:{' '}
                    {showResult
                        ? isLong
                            ? calcLeverage(
                                  new BigNumber(marginAmount).negated(),
                                  new BigNumber(exposureAmount),
                                  new BigNumber(1),
                              ).toNumber()
                            : calcLeverage(
                                  new BigNumber(marginAmount).negated(),
                                  new BigNumber(-Math.abs(exposureAmount)),
                                  new BigNumber(1),
                              ).toNumber()
                        : null}
                </div>

                <div>
                    Liquidation Price:{' '}
                    {showResult
                        ? isLong
                            ? calcLiquidationPrice(
                                  new BigNumber(marginAmount).negated(),
                                  new BigNumber(exposureAmount),
                                  new BigNumber(1),
                                  new BigNumber(25),
                              ).toNumber()
                            : calcLiquidationPrice(
                                  new BigNumber(marginAmount).negated(),
                                  new BigNumber(-Math.abs(exposureAmount)),
                                  new BigNumber(1),
                                  new BigNumber(25),
                              ).toNumber()
                        : null}
                </div>

                <AccountNumberSelect
                    unit={marginUnit}
                    title={'Liquidation Price'}
                    amount={liquidationAmount}
                    balance={balances.tokenBalance.toNumber()}
                    setAmount={setLiquidationAmount}
                    onChange={ChangeLiquidation}
                />

                <CalcButtons>
                    <SButton onClick={Calculate}>Calculate</SButton>
                    <SButton onClick={Reset}>Reset</SButton>
                </CalcButtons>
            </TracerModal>
        );
    },
)``;

const AccountPanel: React.FC<{
    selectedTracer: Tracer | undefined;
    account: string;
}> = ({ selectedTracer, account }) => {
    const [calculator, showCalculator] = useState(false);
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
                    <SButton className="ml-auto mr-1" onClick={() => showCalculator(true)}>
                        Calculator
                    </SButton>
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
            <CalculatorModal
                display={calculator}
                close={() => showCalculator(false)}
                exposureUnit={selectedTracer?.marketId?.split('/')[0] ?? 'NO_ID'}
                marginUnit={selectedTracer?.marketId?.split('/')[1] ?? 'NO_ID'}
                balances={balances}
                price={Number.isNaN(fairPrice) ? 0 : fairPrice}
            />
        </AccountInfo>
    );
};

export default AccountPanel;
