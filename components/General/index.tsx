import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const Box: React.FC<{ className?: string }> = styled.div`
    border: 1px solid #0c3586;
    display: flex;
    padding: 20px;
`;

export const Button: React.FC<{ className?: string; onClick?: any }> = styled.div`
    transition: 0.3s;
    color: #3da8f5;
    font-size: 16px;
    letter-spacing: -0.32px;
    border: 1px solid #3da8f5;
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: 160px;

    &:hover {
        cursor: pointer;
        background: #3da8f5;
        color: #fff;
    }

    &.primary {
        background: #3da8f5;
        color: #fff;
    }

    &.primary:hover {
        background: #03065e;
        color: #3da8f5;
    }

    &.disabled {
        opacity: 0.8;
    }
    &.disabled: hover {
        cursor: not-allowed;
    }
`;

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

export const Card = styled.div`
    background: #011772;
    box-shadow: 0px 5px 10px #00000029;
    border-radius: 5px;
    transition: 0.3s;

    h1 {
        font-size: 20px;
        letter-spacing: -0.4px;
        color: #ffffff;
    }
`;

const clearLogos: Record<string, string> = {
    ETH: '/img/logos/currencies/eth_clear.svg',
};

const logos: Record<string, string> = {
    ETH: '/img/logos/currencies/eth.svg',
};

type Ticker = 'ETH' | 'LINK';
interface LProps {
    className?: string;
    ticker: Ticker;
    clear?: boolean; // true then display outlined image
}
export const Logo: React.FC<LProps> = styled(({ className, ticker, clear }: LProps) => {
    return <img className={className} src={clear ? clearLogos[ticker] : logos[ticker]} />;
})`
    width: 30px;
    margin: 5px 0;
`;

export const Input = styled.input`
    font-size: 42px;
    letter-spacing: 0px;
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

/**
 * Takes two children items, will place the first as the header component and the second as the body
 * @param defaultHeight prevents jumpiness when initialising the dropdown
 */
export const Dropdown = styled(({ className, children, defaultHeight }) => {
    const [open, setOpen] = useState(false);
    const main = useRef(null);
    const header = useRef(null);
    const body = useRef(null);
    useEffect(() => {
        const h = (header.current as unknown) as HTMLDivElement;
        const b = (body.current as unknown) as HTMLDivElement;
        if (open) {
            // all heights plus 10px for padding
            ((main.current as unknown) as HTMLDivElement).style.height = `${h.clientHeight + b.clientHeight + 10}px`;
        } else {
            ((main.current as unknown) as HTMLDivElement).style.height = `${h.clientHeight ?? defaultHeight}px`;
        }
    }, [open]);
    return (
        <div className={`${className} ${open ? 'open' : ''}`} onClick={(_e) => setOpen(!open)} ref={main}>
            <div ref={header}>{children[0]}</div>
            <div className="body" ref={body}>
                {children[1]}
            </div>
        </div>
    );
})`
    overflow: hidden;
    transition: 0.3s ease-in-out;
    margin-left: -10px;
    height: ${(props) => props.defaultHeight}px;
    margin-bottom: 2rem;
    border-radius: 5px;
    text-align: left;
    font-size: 16px;
    letter-spacing: -0.32px;

    &:hover {
        background: #03065e;
    }

    &.open > .body {
        transition: 0.3s ease-in;
        opacity: 0;
    }

    &.open .body {
        opacity: 1;
    }
`;
