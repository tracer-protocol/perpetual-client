import React from 'react';
import { Children } from 'types';
import styled from 'styled-components';

type TSSProps = {
    onClick: (index: number, e: any) => any;
    value: number;
    className?: string;
} & Children;

const SlideSelect: React.FC<TSSProps> = styled(({ onClick, value, children, className }: TSSProps) => {
    return (
        <>
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
            </div>
        </>
    );
})`
    display: flex;
    margin: auto;
    border: 1px solid #3da8f5;
    border-radius: 20px;
`;

export const SlideOption = styled.div`
    display: flex;
    border-radius: 20px;
    font-size: 16px;
    text-align: center;
    width: 100%;
    color: #3da8f5;

    transition: background 0.3;

    &:hover {
        cursor: pointer;
    }

    &.selected {
        background: #3da8f5;
        color: #fff;
        border: 1px solid #3da8f5;
    }
`;

SlideSelect.defaultProps = {
    onClick: () => undefined,
    value: 0,
};

export * from './Options';
export default SlideSelect;
