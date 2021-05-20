import React, { MouseEvent, useEffect, useRef } from 'react';
import TracerLoading from '@components/TracerLoading';

import styled from 'styled-components';
import { Close } from '../General';

interface TProps {
    show: boolean;
    title?: string;
    subTitle?: string;
    onClose: (event: MouseEvent) => void;
    children: React.ReactNode;
    loading: boolean;
    className?: string;
    id?: string;
}

export const Title = styled.h3`
    text-align: left;
    font-size: 20px;
    line-height: 40px;
    letter-spacing: -0.4px;
    color: #ffffff;
`;

export const SubTitle = styled.p`
    text-align: left;
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #3da8f5;
    margin: 1rem 0;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem;
`;

const Overlay = styled.div`
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
`;
const TracerModal: React.FC<TProps> = styled((props: TProps) => {
    const ref = useRef(null);
    useEffect(() => {
        const content: HTMLDivElement = ref.current as unknown as HTMLDivElement;
        if (props.show) {
            if (content !== null) {
                content.classList.add('show');
            }
        } else {
            if (content !== null) {
                content.classList.remove('show');
            }
        }
    }, [props.show]);
    return (
        <div className={`${props.className} ${props.show ? 'show' : ''} model`} id={props.id}>
            {/*content*/}
            <div className={`content`} ref={ref}>
                {/*header*/}
                <Header>
                    <Title>{props.title}</Title>
                    <Close onClick={props.onClose} />
                </Header>
                <div className="flex flex-col">
                    {!props.loading ? (
                        <>
                            {/* body */}
                            <div className="w-full h-full">{props.children}</div>
                        </>
                    ) : (
                        <div className="m-auto text-blue-100">
                            <TracerLoading />
                            <div className="pt-2">...processing...</div>
                        </div>
                    )}
                </div>
            </div>
            <Overlay />
        </div>
    );
})`
    display: none;
    &.show {
        display: block;
    }
    > .content {
        opacity: 0;
        transition: 0.3s;
        opacity: 0;
        background: #011772;
        min-width: 585px;
        border: 0;
        box-shadow: 0px 5px 10px #00000029;
        border-radius: 5px;
        z-index: 40;
        position: fixed;
        margin: auto;
        top: 10%;
        overflow: scroll;
        left: 0;
        right: 0;
        max-width: 40%;
        max-height: 80vh;
    }
    > .content.show {
        opacity: 1;
    }
`;

export default TracerModal;
