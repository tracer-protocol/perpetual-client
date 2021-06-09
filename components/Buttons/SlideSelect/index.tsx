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
            <div className="bg" />
        </div>
    );
})`
    display: flex;
    margin: auto;
    border: 1px solid #3da8f5;
    border-radius: 20px;
    height: 40px;
    position: relative;

    .bg {
        transition: 0.5s;
        background-color: #3da8f5;
        height: 39px;
        width: 170px;
        border-radius: 18px;
        position: absolute;
        top: 0;
    }

    .selected + .bg {
        transition: 0.5s;
        margin-left: 128px;
    }
`;

export const SlideOption = styled.div`
    display: flex;
    border-radius: 18px;
    font-size: 16px;
    text-align: center;
    width: 100%;
    z-index: 1;

    &:hover {
        cursor: pointer;
    }
`;

SlideSelect.defaultProps = {
    onClick: () => undefined,
    value: 0,
};

export * from './Options';
export default SlideSelect;
