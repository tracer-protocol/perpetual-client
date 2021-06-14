import React from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const defaultValue = 1;
const defaultMin = 1;
const defaultMax = 100;

const defaultMarks = {
    1: {
        style: {
            marginTop: '1rem',
            color: '#005EA4',
            fontSize: '1rem',
        },
        label: '1x',
    },
    50: {
        style: {
            marginTop: '1rem',
            color: '#005EA4',
            fontSize: '1rem',
        },
        label: '50x',
    },
    100: {
        style: {
            marginTop: '1rem',
            color: '#005EA4',
            fontSize: '1rem',
        },
        label: '100x',
    },
};

const defaultRailStyle = { backgroundColor: '#002886', height: 10 };
const defaultTrackStyle = { backgroundColor: '#002886', height: 10 };
const defaultHandleStyle = {
    width: '50px',
    height: '30px',
    background: '#3DA8F5',
    borderRadius: '20px',
    marginTop: '-11px',
};

const { Handle } = Slider;
const DefaultHandle = (e: any) => {
    const HandleValue = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1rem;
    `;
    const { value } = e;
    return (
        <Handle {...e}>
            <HandleValue>{value}x</HandleValue>
        </Handle>
    );
};

type DSProps = {
    className?: string;
    value?: number;
    min?: number;
    max?: number;
    marks?: any;
    railStyle?: React.CSSProperties;
    trackStyle?: React.CSSProperties;
    handleStyle?: React.CSSProperties;
};
const DefaultSlider: React.FC<DSProps> = styled(
    ({ className, value, min, max, marks, railStyle, trackStyle, handleStyle }: DSProps) => {
        return (
            <div className={className}>
                <Slider
                    defaultValue={value ? value : defaultValue}
                    min={min ? min : defaultMin}
                    max={max ? max : defaultMax}
                    marks={marks ? marks : defaultMarks}
                    railStyle={railStyle ? railStyle : defaultRailStyle}
                    trackStyle={trackStyle ? trackStyle : defaultTrackStyle}
                    handleStyle={handleStyle ? handleStyle : defaultHandleStyle}
                    handle={DefaultHandle}
                />
            </div>
        );
    },
)`
    .rc-slider-dot {
        display: none;
    }
`;

export default DefaultSlider;
