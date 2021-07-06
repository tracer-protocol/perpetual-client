import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { TracerContext } from 'context';
import { BigNumber } from 'bignumber.js';
import DefaultSlider from '@components/General/Slider';
import { UserBalance } from 'types';
import { SlideSelect } from '@components/Buttons';
import TracerModal from '@components/General/TracerModal';
import { Button, NumberSelect } from '@components/General';
import { Option } from '@components/Buttons/SlideSelect';
import { CalculatorContext, ContextProps } from '@context/CalculatorContext';

const CalcSelectContainer = styled.div`
    margin-top: 1rem;
    border-top: 1px solid var(--color-accent);
`;

const CalcSlideSelect = styled(SlideSelect)`
    max-width: 300px;
    height: var(--height-medium-button);
    margin: 1rem auto;
`;

const SButton = styled(Button)`
    height: var(--height-small-button);
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
        color: var(--color-primary);
    }
    // > * .balance > .max {
    //     margin-left: 2rem;
    // }
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
        font-size: var(--font-size-small);
        color: var(--color-primary);
        margin-bottom: 1rem;
    }
`;

type CalculatorModalProps = {
    className?: string;
    close: () => any;
    display: boolean;
    quoteTicker: string;
    baseTicker: string;
    balances: UserBalance;
    fairPrice: BigNumber;
};
export default styled(({ 
    className, 
    close, 
    baseTicker, 
    quoteTicker, 
    balances, 
    display
}: CalculatorModalProps) => {
    const { selectedTracer } = useContext(TracerContext);
    const { 
        calculatorState: {
            exposure,
            margin, 
            liquidationPrice,
            leverage,
            position
        },
        calculatorDispatch
    } = useContext(CalculatorContext) as ContextProps ;


    const [exposureLocked, setExposureLocked] = useState(false);
    const [marginLocked, setMarginLocked] = useState(false);

    const Calculate = () => {
    };

    const Reset = () => {
        // setExposureAmount(NaN);
        // setMarginAmount(NaN);
        // setLiquidationAmount(NaN);

        setExposureLocked(false);
        setMarginLocked(false);
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
                <CalcSlideSelect value={position} onClick={() => calculatorDispatch({ type: 'setPosition' })}>
                    <Option>Long</Option>
                    <Option>Short</Option>
                </CalcSlideSelect>
            </CalcSelectContainer>

            <AccountNumberSelect
                unit={baseTicker}
                title={'Exposure'}
                amount={exposure}
                setAmount={(val) => {
                    calculatorDispatch({ type: 'setExposure', value: val})
                }}
                hasLock={true}
                // isLocked={exposureLocked}
                // lockOnClick={() => setExposureLocked(!exposureLocked)}
            />

            <AccountNumberSelect
                unit={quoteTicker}
                title={'Margin'}
                amount={margin}
                balance={balances.tokenBalance.toNumber()}
                setAmount={(val) => calculatorDispatch({ type: 'setMargin', value: val})}
                hasLock={true}
                // isLocked={marginLocked}
                // lockOnClick={() => setMarginLocked(!marginLocked)}
            />

            <Leverage value={leverage} 
                handleChange={(val) => calculatorDispatch({ type: 'setLeverage', value: val })} 
            />
            {/* <input value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} /> */}

            <div>
                Leverage:{' '}
                {/* {showResult
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
                    : null} */}
            </div>

            <AccountNumberSelect
                unit={quoteTicker}
                title={'Liquidation Price'}
                amount={liquidationPrice}
                balance={balances.tokenBalance.toNumber()}
                setAmount={(val) => calculatorDispatch({ type: 'setLiquidationPrice', value: val})}
            />

            <CalcButtons>
                <SButton onClick={Calculate}>Calculate</SButton>
                <SButton onClick={Reset}>Reset</SButton>
            </CalcButtons>
        </TracerModal>
    );
})`` as React.FC<CalculatorModalProps>;
