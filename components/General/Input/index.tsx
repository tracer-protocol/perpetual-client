import React from 'react';
import styled from 'styled-components';

export const Input = styled.input`
    font-size: 42px;
    height: 40px;
    line-height: 40px;
    letter-spacing: 0;
    color: #ffffff;
    width: 100%;

    &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #fff;
        opacity: 1; /* Firefox */
    }

    &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #fff;
    }

    &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #fff;
    }

    &:focus {
        border: none;
        outline: none;
        box-shadow: none;
    }
`;

export const BasicInputContainer = styled.div`
    width: 100%;
    display: flex;
    border-bottom: 1px solid #002886;
`;

type CProps = {
    className?: string;
    checked?: boolean;
    onClick: any;
};
export const Checkbox: React.FC<CProps> = styled(({ className, checked, onClick }: CProps) => {
    return (
        <span className={className} onClick={onClick}>
            <input type="checkbox" checked={checked} readOnly />
            <span className="checkmark" />
        </span>
    );
})`
    border: 1px solid #3da8f5;
    width: 1.7rem;
    height: 1.1rem;
    display: block;
    position: relative;
    border-radius: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: 0.3s;

    /* Hide the browser's default checkbox */
    & > input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    & > .checkmark {
        position: absolute;
        transition: 0.3s;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }

    /* On mouse-over, add a grey background color */
    &:hover {
        opacity: 0.8;
    }

    /* When the checkbox is checked, add a blue background */
    & > input:checked ~ .checkmark {
        background-color: #3da8f5;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    & > .checkmark:after {
        content: '';
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    & > input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    & > .checkmark:after {
        left: 10px;
        top: 3px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export * from './NumberSelect';
export * from './SmallInput';
export * from './NumberInput';
