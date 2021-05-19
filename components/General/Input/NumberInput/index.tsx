import React from 'react';
import styled from 'styled-components';

const Inc = styled.div`
    position: absolute;
    left: 5px;
    top: 5px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #3da8f5;
    transition: 0.3s;
    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

const Dec = styled.div`
    position: absolute;
    left: 5px;
    bottom: 5px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #3da8f5;
    transition: 0.3s;
    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

export const NumberInput: React.FC<any> = styled((props: any) => {
    return (
        <>
            <input {...props} />
            <Inc onClick={() => props.onChange({ target: { value: props.value + 1 } })} />
            <Dec onClick={() => props.onChange({ target: { value: props.value - 1 } })} />
        </>
    );
})`
    position: relative;

    /* Chrome, Safari, Edge, Opera */
    & input::-webkit-outer-spin-button,
    & input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    & input[type='number'] {
        -moz-appearance: textfield;
    }
`;
