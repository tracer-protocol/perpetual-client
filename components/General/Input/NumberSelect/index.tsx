import React from 'react';
import { Children } from 'types';
import styled from 'styled-components';
import { BasicInputContainer, Input } from '../';

const Unit = styled.span`
    font-size: 18px;
    letter-spacing: 0px;
    color: #3da8f5;
    margin-top: auto;
    margin-bottom: 0.2rem;
`;

const Header = styled.h3`
    font-size: 1rem;
    letter-spacing: -0.32px;
    color: #3da8f5;
    display: flex;
    justify-content: space-between;
`;

const Balance = styled.span`
    color: #fff;
    .max {
        color: #3da8f5;
        text-decoration: underline;
        transition: 0.3s;
        margin-left: 5px;
    }
    .max:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

type NSProps = {
    amount: number;
    setAmount: (number: number) => void;
    unit: string;
    title: string;
    balance?: number;
    className?: string;
} & Children;

export const NumberSelect: React.FC<NSProps> = ({ setAmount, amount, unit, title, balance, className }: NSProps) => {
    return (
        <div className={className}>
            <Header>
                {title}
                {balance ? ( // if there is a balance then display it
                    <Balance className="balance">
                        {`Available Balance: ${balance}`}
                        <span className="max" onClick={(_e) => setAmount(balance)}>
                            Max
                        </span>
                    </Balance>
                ) : (
                    ''
                )}
            </Header>
            <BasicInputContainer>
                <Input
                    id="username"
                    type="number"
                    autoComplete="off"
                    min={0}
                    placeholder="0.0"
                    onChange={(e) => setAmount(Math.abs(parseFloat(e.target.value)))}
                    value={amount ? amount : ''}
                />
                <Unit>{unit}</Unit>
            </BasicInputContainer>
        </div>
    );
};

export default NumberSelect;
