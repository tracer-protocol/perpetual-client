import { CloseOutlined } from '@ant-design/icons';
import { Children } from '@components/types';
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
    font-size: 1rem;
    line-height: 1rem;
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
 * Similiar component to dropdown only there is no content to begin with
 */
type HEProps = {
    defaultHeight: number; // defaults to 0
    open: boolean;
    className?: string;
} & Children;
export const HiddenExpand: React.FC<HEProps> = styled(({ className, children, defaultHeight, open }: HEProps) => {
    const main = useRef(null);
    const body = useRef(null);
    useEffect(() => {
        const b = (body.current as unknown) as HTMLDivElement;
        if (open) {
            // all heights plus 10px for padding
            ((main.current as unknown) as HTMLDivElement).style.height = `${b.clientHeight + 10}px`;
        } else {
            ((main.current as unknown) as HTMLDivElement).style.height = `${defaultHeight}px`;
        }
    }, [open]);
    return (
        <div className={`${className} ${open ? 'open' : ''}`} ref={main}>
            <div className="body" ref={body}>
                {children}
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
    background: #03065e;

    & > .body {
        transition: 0.3s ease-in;
        opacity: 0;
        padding: 10px;
    }

    &.open .body {
        opacity: 1;
    }
`;

/**
 * Takes two children items, will place the first as the header component and the second as the body
 * @param defaultHeight prevents jumpiness when initialising the dropdown
 */
type DProps = {
    defaultHeight: number; // defaults to 0
    className?: string;
    header: React.ReactNode;
    body: React.ReactNode;
};
export const Dropdown: React.FC<DProps> = styled(({ className, header, body, defaultHeight }: DProps) => {
    const [open, setOpen] = useState(false);
    const main = useRef(null);
    const _header = useRef(null);
    const _body = useRef(null);
    useEffect(() => {
        const h = (_header.current as unknown) as HTMLDivElement;
        const b = (_body.current as unknown) as HTMLDivElement;
        if (open) {
            // all heights plus 10px for padding
            ((main.current as unknown) as HTMLDivElement).style.height = `${h.clientHeight + b.clientHeight + 10}px`;
        } else {
            ((main.current as unknown) as HTMLDivElement).style.height = `${
                !!h.clientHeight ? h.clientHeight : defaultHeight
            }px`;
        }
    }, [open]);
    return (
        <div className={`${className} ${open ? 'open' : ''}`} onClick={(_e) => setOpen(!open)} ref={main}>
            <div ref={_header}>{header}</div>
            <div className="body" ref={_body}>
                {body}
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

export const Previous = styled.span`
    color: #005ea4;
    margin-right: 5px;
    &:after {
        padding-left: 2px;
        content: '>>>';
    }
`;
export const After = styled.span`
    color: #005ea4;
    &:before {
        padding-right: 0.5rem;
        content: '>>>';
    }
`;

type CProps = {
    className?: string;
    checked?: boolean;
    onClick: any;
};
export const Checkbox: React.FC<CProps> = styled(({ className, checked, onClick }: CProps) => {
    return (
        <span className={className} onClick={onClick}>
            <input type="checkbox" checked={checked} />
            <span className="checkmark"></span>
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
    transoition: 0.3s;

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

export const Close = styled(CloseOutlined)`
    background: #002886;
    border-radius: 20px;
    width: 58px;
    height: 40px;
    transition: 0.3s;
    display: flex;
    top: 0;
    right: 20px;
    > svg {
        transition: 0.3s;
        margin: auto;
        height: 20px;
        width: 20px;
        color: #fff;
    }
    &:hover {
        cursor: pointer;
        background: #3da8f5;
    }
    &:hover svg {
    }
`;
