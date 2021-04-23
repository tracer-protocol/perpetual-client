import React, { ChangeEvent } from 'react';
import { Children } from '@components/types';
import styled from 'styled-components';


const InputContainer = styled.div`
    background: #002886;
    border-radius: 20px;
    display: flex;
    padding: 5px 10px;
    width: 250px;

    > .max {
        margin: auto 0;
        letter-spacing: -0.32px;
        font-size: 16px;
    }

    > .max.hide {
        display: none;
    }

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
    > .unit {
        letter-spacing: -0.4px;
        color: #3DA8F5;
        font-size: 20px;
        margin: auto 0;
        margin-left: auto;
        padding-left: 4px;
    }
`

type SIProps = {
    amount: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setMax?: (e: any) => void;
    unit: string;
    title: string;
    className?: string;
} & Children;

const SmallInput: React.FC<SIProps> = styled(({ 
    title, amount, onChange, unit, setMax, className
}: SIProps) => (
    <div className={className}>
        <a className="label">{title}</a>
        <InputContainer>
            <a className={`max ${!setMax ? 'hide' : ''}`} onClick={setMax}>
                Max
            </a>
            <input
                id="margin"
                type="number"
                placeholder="0.0"
                onChange={onChange}
                value={amount}
            />
            <a className="unit">{unit}</a>
        </InputContainer>
    </div>
))`
    display: flex;
    width: 100%;
    justify-content: space-between;

    > .label {
        letter-spacing: -0.32px;
        font-size: 16px;
        color: #3DA8F5;
        margin: auto 0;
        text-transform: capitalize;
    }


`

export default SmallInput;
