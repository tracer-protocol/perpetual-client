import React from 'react';
import { Children } from 'types';
import styled from 'styled-components';
import { BasicInputContainer, Input } from '../';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { toApproxCurrency } from '@libs/utils';
import { After } from '@components/General';

const Unit = styled.span`
    font-size: var(--font-size-medium);
    line-height: var(--font-size-medium);
    letter-spacing: 0;
    color: var(--color-primary);
    margin-top: auto;
    margin-bottom: 0.2rem;
    white-space: nowrap;
`;

const Header = styled.h3`
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: var(--color-primary);
    display: flex;
    justify-content: space-between;
`;

const Balance = styled.span`
    color: var(--color-text);
    margin-left: auto;
    &.invalid {
        background: #f15025;
        border-radius: 20px;
        color: var(--color-text) !important;
        padding: 0 10px;
    }
    &.invalid > .after {
        color: var(--color-text) !important;
    }
`;

const Max = styled.span`
    color: var(--color-primary);
    text-decoration: underline;
    transition: 0.3s;
    margin-left: 5px;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

export const LockContainer = styled.div`
    margin-top: 0.125rem;
    margin-right: 0.125rem;
    color: #f4ab57;
    font-size: 1.2rem;
    padding: 0 0.7rem;
    height: 24px;
    margin-bottom: 0.2rem;
    margin-top: auto;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    border: 1px solid #f4ab57;
`

type NSProps = {
    className?: string;
    amount: number;
    setAmount: (number: number) => void;
    unit: string;
    title: string;
    balance?: number;
    displayLock?: boolean;
    isLocked?: boolean;
    lockOnClick?: (e: any) => any;
} & Children;

export const NumberSelect: React.FC<NSProps> = ({
    className,
    setAmount,
    amount,
    unit,
    title,
    balance,
    displayLock,
    isLocked,
    lockOnClick,
}: NSProps) => {
    const getLock = (hasLock: boolean | undefined, isLocked: boolean | undefined) => {
        if (hasLock) {
            if (isLocked) {
                return (
                    <LockContainer>
                        <LockOutlined
                            onClick={lockOnClick}
                        />
                    </LockContainer>
                );
            } else {
                return (
                    <LockContainer>
                        <UnlockOutlined
                            onClick={lockOnClick}
                        />
                    </LockContainer>
                );
            }
        } else {
            return null;
        }
    };

    return (
        <div className={className}>
            <Header>
                {title}
                {balance || balance === 0 ? ( // if there is a balance then display it
                    <>
                        <Balance className={`balance ${amount > balance ? 'invalid' : ''}`}>
                            {`Available: ${balance}`}
                            {amount ? <After className="ml-2 after">{toApproxCurrency(balance - amount)}</After> : null}
                        </Balance>
                        <Max className="max" onClick={(_e) => setAmount(balance)}>
                            Max
                        </Max>
                    </>
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
                    value={!Number.isNaN(amount) ? amount : ''}
                />
                {getLock(displayLock, isLocked)}
                <Unit>{unit}</Unit>
            </BasicInputContainer>
        </div>
    );
};

export default NumberSelect;
