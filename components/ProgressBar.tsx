import React from 'react';
import styled from 'styled-components';

interface IProps {
    percent: number;
    className?: string;
}

const ProgressBar: React.FC<IProps> = styled(({ percent, className }: IProps) => {
    return (
        <div className={className}>
            <div className="progress" />
            <p className="label">{percent}%</p>
        </div>
    );
})`
    background: #002886;
    position: relative;
    height: 32px;
    border-radius: 20px;

    > .progress {
        transition: 0.3s;
        background: #3da8f5;
        height: 100%;
        width: ${(props) => `${props.percent}%`};
        border-radius: 20px;
        max-width: 100%;
    }

    > .label {
        letter-spacing: -0.32px;
        font-size: 16px;
        position: absolute;
        height: fit-content;
        width: fit-content;
        top: 0;
        bottom: 0;
        left: ${(props) => (props.percent !== 0 && props.percent < 100 ? 'auto' : '0')};
        right: ${(props) => (props.percent !== 0 && props.percent < 100 ? 'auto' : '0')};
        left: ${(props) =>
            `${props.percent !== 0 && props.percent < 100 ? `calc(${props.percent / 2}% - 16px)` : '0'}`};
        margin: auto;
    }
`;

export default ProgressBar;
