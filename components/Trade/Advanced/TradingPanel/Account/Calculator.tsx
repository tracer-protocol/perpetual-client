import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { calcLeverage, calcLiquidationPrice } from '@tracer-protocol/tracer-utils';
import { TracerContext } from 'context';
import { BigNumber } from 'bignumber.js';
import DefaultSlider from '@components/General/Slider';
import { UserBalance } from 'types';
import { SlideSelect } from '@components/Buttons';
import TracerModal from '@components/General/TracerModal';
import { Button, NumberSelect } from '@components/General';
import { Option } from '@components/Buttons/SlideSelect';

const CalcSelectContainer = styled.div`
    margin-top: 1rem;
    border-top: 1px solid #002886;
`;

const CalcSlideSelect = styled(SlideSelect)`
    max-width: 300px;
    margin: 1rem auto;
`;

const SButton = styled(Button)`
    height: 28px;
    line-height: 28px;
    padding: 0;
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
    handleChange: (val: number) => any;
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
export default styled(({ className, close, exposureUnit, marginUnit, balances, display }: CalculatorModalProps) => {
    const { selectedTracer } = useContext(TracerContext);
    const [leverage, setLeverage] = useState(1);
    const [exposureAmount, setExposureAmount] = useState(NaN);
    const [marginAmount, setMarginAmount] = useState(NaN);
    const [liquidationAmount, setLiquidationAmount] = useState(NaN);

    const [isLong, setPosition] = useState(true);
    const [showResult, setShowResult] = useState(false);

    const [exposureLocked, setExposureLocked] = useState(false);
    const [marginLocked, setMarginLocked] = useState(false);

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

    // const ChangeExposure = (e: any) => {
    //     setExposureAmount(Math.abs(parseFloat(e.target.value)));
    //     setShowResult(false);
    // };

    // const ChangeMargin = (e: any) => {
    //     setMarginAmount(Math.abs(parseFloat(e.target.value)));
    //     setShowResult(false);
    // };

    // const ChangeLiquidation = (e: any) => {
    //     setLiquidationAmount(Math.abs(parseFloat(e.target.value)));
    //     setShowResult(false);
    // };

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
                // onChange={ChangeExposure}
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
                // onChange={ChangeMargin}
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
                // onChange={ChangeLiquidation}
            />

            <CalcButtons>
                <SButton onClick={Calculate}>Calculate</SButton>
                <SButton onClick={Reset}>Reset</SButton>
            </CalcButtons>
        </TracerModal>
    );
})`` as React.FC<CalculatorModalProps>;
