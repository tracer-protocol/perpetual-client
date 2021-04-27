import React from 'react';
import styled from 'styled-components';



export const SNav = styled.div`
    letter-spacing: -0.36px;
    font-size: 18px;
    // border-top: 2px solid #03065e;
    border-bottom: 2px solid #0C3586;
    display: flex;
`

export const SNavItem = styled.div`
    color: #005EA4;
    transition: 0.3s;
    border-right: 2px solid #0C3586;
    text-align: center;
    padding: 15px;
    width: 125px;
    &.selected {
        background: #002886;
        color: #fff;
    }

    &:hover {
        cursor:pointer;
    }
`
export const SubNav: React.FC<SNBProps> = (props: SNBProps) => {
    const { tabs, selected, setTab } = props;
    return (
        <SNav>
            {tabs.map((tab_, index) => 
                <SNavItem 
                    className={index === selected ? 'selected' : ''}
                    onClick={(e) => { e.preventDefault(); setTab(index)}}
                >
                    {tab_}
                </SNavItem>
            )}
        </SNav>
    )

}


interface SNBProps {
    selected: number;
    tabs: string[];
    setTab: (id: number) => void;
    background?: string;
    position?: 'end' | 'start';
}

// TODO remove
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
