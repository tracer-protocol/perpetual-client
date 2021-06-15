import React, { ChangeEvent } from 'react';
import { Children } from 'types';
import styled from 'styled-components';
import { NumberInput } from '@components/General';

const Max = styled.a`
    transition: 0.3s;
    margin: auto 0;
    margin-left: 20px;
    letter-spacing: -0.32px;
    font-size: 16px;
    color: #3da8f5;
    text-decoration: underline;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
        text-decoration: underline;
    }
    &.hide {
        display: none;
    }

`

const InputContainer = styled.div`
    background: #002886;
    border-radius: 20px;
    display: flex;
    padding: 5px 10px;
    width: 250px;
    position: relative;

    > input {
        width: 100%;
        color: #fff;
        text-align: right;
        padding-left: 10px;
        font-size: 20px;
        width: 100%;
        &:focus {
            outline: none;
            shadow: none;
        }
    }
    > input[type='number']::-webkit-inner-spin-button,
    > input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: 'Always Show Up/Down Arrows';
    }
    > .unit {
        letter-spacing: -0.4px;
        color: #005ea4;
        font-size: 20px;
        margin: auto 0;
        margin-left: auto;
        padding-left: 4px;
    }
`;

type SIProps = {
    amount: number | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setMax?: (e: any) => void;
    unit: string;
    title: string;
    maxText?: string; // used if you dont want it to be max
    className?: string;
} & Children;

const SmallInput: React.FC<SIProps> = styled(({ 
    title, amount, onChange, unit, setMax, maxText, className
}: SIProps) => (
    <div className={className}>
        <a className="label">{title}</a>
        <InputContainer>
            <Max className={`${!setMax ? 'hide' : ''}`} onClick={setMax}>
                {maxText}
            </Max>
            <NumberInput
                id="margin"
                type="number"
                placeholder="0.0"
                min="0"
                onChange={onChange}
                value={!Number.isNaN(amount) ? amount : ''}
            />
            <a className="unit">{unit}</a>
        </InputContainer>
    </div>
))`
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 12px;

    > .label {
        letter-spacing: -0.32px;
        font-size: 16px;
        color: #3da8f5;
        margin: auto 0;
        text-transform: capitalize;
    }
`;

SmallInput.defaultProps = {
    maxText: "Max"
}

export default SmallInput;
