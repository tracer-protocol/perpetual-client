import React, { FC, useEffect, useRef, useState } from 'react';
import { Children } from 'libs/types';
import styled from 'styled-components';

interface BGSProps {
    position: number;
    width: number;
    startTransition: boolean;
}
const BGSlider = styled.div<BGSProps>`
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 18px;
    background-color: var(--color-primary);
    height: 100%;
    width: ${(props: BGSProps) => props.width}%;
    margin-left: ${(props: BGSProps) => props.position}%;
    transition: ${(props: BGSProps) => (props.startTransition ? '0.5s' : 'none')};
`;

type TSSProps = {
    onClick: (index: number, e: any) => any;
    value: number;
    className?: string;
} & Children;

const SlideSelect: FC<TSSProps> = styled(({ onClick, value, children, className }: TSSProps) => {
    const [numChildren, setNumChildren] = useState(0);
    const [startTransition, setStartTransition] = useState(false);
    const calcPosition = (numChildren: number) => value * (1 / numChildren) * 100;
    useEffect(() => {
        const numChildren = React.Children.toArray(children).length;
        setNumChildren(numChildren);
    }, []);

    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(event: any) {
            // @ts-ignore
            if (ref.current && ref.current.contains(event.target)) {
                setStartTransition(true);
            } else {
                setStartTransition(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return (
        <div ref={ref} className={className}>
            {React.Children.toArray(children).map((child, index) => {
                return (
                    <SlideOption
                        onClick={(e) => onClick(index, e)}
                        key={`slide-option-${index}`}
                        className={`${index === value ? 'selected' : ''}`}
                    >
                        {child}
                    </SlideOption>
                );
            })}
            <BGSlider
                className="bg-slider"
                position={calcPosition(numChildren)}
                width={(1 / numChildren) * 100}
                startTransition={startTransition}
            />
        </div>
    );
})`
    display: flex;
    margin: auto;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    height: 32px;
    position: relative;
`;

export const SlideOption = styled.div`
    display: flex;
    border-radius: 18px;
    font-size: var(--font-size-small);
    text-align: center;
    width: 100%;
    padding: 0 0.8rem;
    z-index: 1;

    &:hover {
        cursor: pointer;
    }
`;

export * from './Options';
export default SlideSelect;
