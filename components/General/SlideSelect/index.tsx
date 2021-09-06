import React, { FC, useEffect, useState } from 'react';
import { Children } from 'libs/types';
import styled from 'styled-components';

interface BGSProps {
    position: number;
    width: number;
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
    transition: 0.5s;
`;

type TSSProps = {
    onClick: (index: number, e: any) => any;
    value: number;
    initialisationValue?: number;
    className?: string;
} & Children;

const SlideSelect: FC<TSSProps> = styled(({ onClick, value, initialisationValue, children, className }: TSSProps) => {
    const [numChildren, setNumChildren] = useState(initialisationValue ?? 0);
    const calcPosition = (numChildren: number) => value * (1 / numChildren) * 100;

    useEffect(() => {
        const numChildren = React.Children.toArray(children).length;
        setNumChildren(numChildren);
    }, []);

    return (
        <div className={className}>
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
            <BGSlider className="bg-slider" position={calcPosition(numChildren)} width={(1 / numChildren) * 100} />
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

export const Option = styled.a`
    margin: auto 0;
    width: 100%;
`;

export default SlideSelect;
