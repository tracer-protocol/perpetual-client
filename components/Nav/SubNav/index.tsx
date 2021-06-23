import React from 'react';
import styled from 'styled-components';

export interface SNBProps {
    selected: number;
    tabs: string[];
    setTab: (id: number) => void;
    background?: string;
    position?: 'end' | 'start';
}

export const SubNavContainer = styled.div`
    letter-spacing: -0.36px;
    font-size: var(--font-size-medium);
    border-bottom: 1px solid #0c3586;
    display: flex;
    height: var(--height-small-container);
`;

export const SubNavItem = styled.div`
    color: var(--color-text);
    transition: 0.3s;
    border-right: 1px solid #0c3586;
    text-align: center;
    padding: 0 15px;
    min-width: 125px;

    &.selected {
        background: var(--color-accent);
        color: var(--color-text);
    }

    &:hover {
        cursor: pointer;
    }
`;

const SubNav: React.FC<SNBProps> = (props: SNBProps) => {
    const { tabs, selected, setTab } = props;
    return (
        <SubNavContainer>
            {tabs.map((tab_, index) => (
                <SubNavItem
                    className={index === selected ? 'selected' : ''}
                    key={`sub-nav-${index}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setTab(index);
                    }}
                >
                    {tab_}
                </SubNavItem>
            ))}
        </SubNavContainer>
    );
};

export default SubNav;
