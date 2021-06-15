import React from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const DEFAULT_VALUE = 1;
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 100;

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
    defaultValue?: number;
    value?: number;
    min?: number;
    max?: number;
    marks?: any;
    railStyle?: React.CSSProperties;
    trackStyle?: React.CSSProperties;
    handleStyle?: React.CSSProperties;
    handleChange: (val: number) => any;
};
const DefaultSlider: React.FC<DSProps> = styled(
    ({
        className,
        defaultValue,
        value,
        min,
        max,
        marks,
        railStyle,
        trackStyle,
        handleStyle,
        handleChange,
    }: DSProps) => {
        return (
            <div className={className}>
                {value ? (
                    <Slider
                        defaultValue={defaultValue ? defaultValue : DEFAULT_VALUE}
                        value={value}
                        min={min ? min : DEFAULT_MIN}
                        max={max ? max : DEFAULT_MAX}
                        marks={marks ? marks : defaultMarks}
                        railStyle={railStyle ? railStyle : defaultRailStyle}
                        trackStyle={trackStyle ? trackStyle : defaultTrackStyle}
                        handleStyle={handleStyle ? handleStyle : defaultHandleStyle}
                        handle={DefaultHandle}
                        onChange={handleChange}
                    />
                ) : (
                    <Slider
                        defaultValue={defaultValue ? defaultValue : DEFAULT_VALUE}
                        min={min ? min : DEFAULT_MIN}
                        max={max ? max : DEFAULT_MAX}
                        marks={marks ? marks : defaultMarks}
                        railStyle={railStyle ? railStyle : defaultRailStyle}
                        trackStyle={trackStyle ? trackStyle : defaultTrackStyle}
                        handleStyle={handleStyle ? handleStyle : defaultHandleStyle}
                        handle={DefaultHandle}
                        onChange={handleChange}
                    />
                )}
            </div>
        );
    },
)`
    .rc-slider-dot {
        display: none;
    }
`;

export default DefaultSlider;
