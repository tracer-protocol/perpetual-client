import React from 'react';
import styled from 'styled-components';

interface SNBProps {
    selected: number;
    tabs: string[];
    setTab: (id: number) => void;
    background?: string;
    position?: 'end' | 'start';
}

const SideNavContainer = styled.div`
    letter-spacing: -0.36px;
    font-size: var(--font-size-medium);
    border-bottom: 1px solid #0c3586;
`;

const SideNavItem = styled.div`
    color: var(--color-primary);
    transition: 0.3s;
    padding: 15px;
    min-width: 125px;

    &.selected {
        background: #005ea4;
        color: var(--color-text);
    }

    &:hover {
        cursor: pointer;
    }
`;

const SideNav: React.FC<SNBProps> = (props: SNBProps) => {
    const { tabs, selected, setTab } = props;
    return (
        <SideNavContainer>
            {tabs.map((tab_, index) => (
                <SideNavItem
                    className={index === selected ? 'selected' : ''}
                    key={`sub-nav-${index}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setTab(index);
                    }}
                >
                    {tab_}
                </SideNavItem>
            ))}
        </SideNavContainer>
    );
};

export default SideNav;
