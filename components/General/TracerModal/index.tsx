import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';
import { Close } from '..';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';

interface TProps {
    show: boolean;
    title?: string;
    subTitle?: string;
    onClose: () => void;
    children: React.ReactNode;
    loading: boolean;
    className?: string;
    id?: string;
}

export const Title = styled.h3`
    text-align: left;
    font-size: var(--font-size-medium);
    line-height: 40px;
    letter-spacing: -0.4px;
    color: #ffffff;
`;

export const SubTitle = styled.p`
    text-align: left;
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: var(--color-primary);
    margin: 1rem 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-accent);
`;

const Logo = styled.div`
    font-size: 150px;
    color: #fff;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Overlay = styled.div<{ show: boolean }>`
    background: rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    position: fixed;
    opacity: ${(props) => (props.show ? '1' : '0')};
    display: ${(props) => (props.show ? 'block' : 'none')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
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

        function handleClickOutside(event: any) {
            // @ts-ignore
            if (!ref.current.contains(event.target)) {
                props.onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.show]);

    return (
        <>
            <div className={`${props.className} ${props.show ? 'show' : ''} model`} id={props.id}>
                {/*content*/}
                <div className={`content`} ref={ref}>
                    {/*header*/}
                    <Header>
                        <Title>{props.title}</Title>
                        <Close onClick={props.onClose} />
                    </Header>
                    {props.subTitle ? <SubTitle>{props.subTitle}</SubTitle> : null}
                    {!props.loading ? (
                        <>
                            {/* body */}
                            {props.children}
                        </>
                    ) : (
                        <Logo>
                            <Icon component={TracerLoading} />
                        </Logo>
                    )}
                </div>
            </div>
            <Overlay show={props.show} />
        </>
    );
})`
    display: none;
    &.show {
        display: block;
    }
    position: fixed;
    left: 0;
    right: 0;
    z-index: 3;
    top: 10%;
    max-width: 585px;
    margin: auto;

    > .content {
        opacity: 0;
        transition: 0.3s;
        padding: 1rem;
        width: 100%;
        background: #011772;
        border: 0;
        box-shadow: 0 5px 10px #00000029;
        border-radius: 5px;
        z-index: 1000;
        margin: auto;
        overflow: scroll;
        max-height: 80vh;
        min-height: 280px;
    }
    > .content.show {
        opacity: 1;
    }
`;

export default TracerModal;
