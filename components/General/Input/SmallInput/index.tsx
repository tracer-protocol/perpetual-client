import React, { ChangeEvent } from 'react';
import { Children } from 'libs/types';
import styled from 'styled-components';
import { NumberInput } from '@components/General';
import TooltipSelector, { TooltipSelectorProps } from '@components/Tooltips/TooltipSelector';

const Max = styled.a`
    transition: 0.3s;
    margin: auto 0 auto 20px;
    letter-spacing: var(--letter-spacing-small);
    font-size: var(--font-size-small);
    color: var(--color-primary);
    text-decoration: underline;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
        text-decoration: underline;
    }
    &.hide {
        display: none;
    }
`;

const Unit = styled.div`
    letter-spacing: var(--letter-spacing-extra-small);
    color: var(--color-secondary);
    font-size: var(--font-size-medium);
    line-height: var(--font-size-medium);
    margin: auto 0 auto auto;
    padding-left: 4px;
`;

export const InputContainer = styled.div`
    background: var(--color-accent);
    border-radius: 20px;
    display: flex;
    padding: 5px 10px;
    width: 250px;
    position: relative;

    > input {
        width: 100%;
        color: var(--color-text);
        text-align: right;
        padding-left: 1.5rem;
        font-size: var(--font-size-medium);
        &:focus {
            outline: none;
        }
    }
`;

type SIProps = {
    amount: number | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setMax?: (e: any) => void;
    unit?: string;
    title: string;
    maxText?: string; // used if you dont want it to be max
    className?: string;
    tooltip?: TooltipSelectorProps;
} & Children;

const SmallInput: React.FC<SIProps> = styled(
    ({ title, amount, onChange, unit, setMax, maxText, tooltip, className }: SIProps) => {
        return (
            <div className={className}>
                {tooltip ? (
                    <TooltipSelector tooltip={tooltip}>{title}</TooltipSelector>
                ) : (
                    <span className="label">{title}</span>
                )}
                <InputContainer>
                    <Max className={`${!setMax ? 'hide' : ''}`} onClick={setMax}>
                        {maxText}
                    </Max>
                    <NumberInput
                        id="margin"
                        type="number"
                        placeholder="0.0"
                        min={0}
                        onChange={onChange}
                        // This always displays a positive value. It also effects the onChange
                        value={!Number.isNaN(amount) ? Math.abs(amount ?? 0) : ''}
                    />
                    {unit ? <Unit>{unit}</Unit> : null}
                </InputContainer>
            </div>
        );
    },
)`
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin: 12px 0;
    height: 32px;

    > .label {
        letter-spacing: var(--letter-spacing-small);
        font-size: var(--font-size-small);
        color: var(--color-primary);
        margin: auto 0;
        text-transform: capitalize;
    }
`;

SmallInput.defaultProps = {
    maxText: 'Max',
};

export default SmallInput;
