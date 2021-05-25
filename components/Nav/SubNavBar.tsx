import React from 'react';
import styled from 'styled-components';

export const SubNavContainer = styled.div`
    letter-spacing: -0.36px;
    font-size: 18px;
    border-bottom: 2px solid #0c3586;
    display: flex;
`;

export const SNavItem = styled.div`
    color: #005ea4;
    transition: 0.3s;
    border-right: 2px solid #0c3586;
    text-align: center;
    padding: 15px;
    min-width: 125px;

    &.selected {
        background: #002886;
        color: #fff;
    }

    &:hover {
        cursor: pointer;
    }
`;

export const SubNav: React.FC<SNBProps> = (props: SNBProps) => {
    const { tabs, selected, setTab } = props;
    return (
        <SubNavContainer>
            {tabs.map((tab_, index) => (
                <SNavItem
                    className={index === selected ? 'selected' : ''}
                    key={`sub-nav-${index}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setTab(index);
                    }}
                >
                    {tab_}
                </SNavItem>
            ))}
        </SubNavContainer>
    );
};

interface SNBProps {
    selected: number;
    tabs: string[];
    setTab: (id: number) => void;
    background?: string;
    position?: 'end' | 'start';
}

export const SubNavBar: React.FC<SNBProps> = (props: SNBProps) => {
    const background = `${props.background ? `bg-${props.background}` : 'bg-blue-200'} `;
    const position = `${props.position ? `justify-${props.position} ` : 'justify-center '}`;
    const button = 'text-blue-100 cursor-pointer flex mx-4 ';
    const selected = 'border-b-4 border-blue-100 font-bold';
    return (
        <div className={`h-screen/3 w-full flex ${background} ${position}`}>
            <div className={`h-full flex flex-row`}>
                {props.tabs.map((tab, index) => {
                    return (
                        <div
                            onClick={() => props.setTab(index)}
                            key={`sub-nav-${index}`}
                            className={button + (props.selected === index ? selected : '')}
                        >
                            <a className="m-auto">{tab}</a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
