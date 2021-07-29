import React from 'react';
import styled from 'styled-components';
import { Counter } from '@components/Portfolio';

export interface SNBProps {
    tabs: any[];
    selected: number;
    setTab: (id: number) => void;
    children?: React.ReactNode;
}

export const SubNavContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #0c3586;

    .dropdown {
        position: absolute;
        right: 15px;
    }
`;

export const SubNavItem = styled.div`
    height: var(--height-small-container);
    display: flex;
    align-items: center;
    transition: 0.3s;
    color: var(--color-secondary);
    padding: 10px 15px;
    font-size: var(--font-size-small-heading);
    line-height: var(--font-size-small-heading);
    border-right: 1px solid var(--table-lightborder);
    text-align: center;

    &.selected {
        background: var(--color-accent);
        color: var(--color-text);

        ${Counter} {
            background-color: var(--color-primary);
            color: var(--color-accent);
        }
    }

    &:hover {
        cursor: pointer;
    }
`;

const SubNav: React.FC<SNBProps> = ({ tabs, selected, setTab, children }: SNBProps) => {
    return (
        <SubNavContainer>
            {tabs.map((tab, index: number) => (
                <SubNavItem
                    className={index === selected ? 'selected' : ''}
                    key={`sub-nav-${index}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setTab(index);
                    }}
                >
                    {tab}
                </SubNavItem>
            ))}
            <div className="dropdown">{children}</div>
        </SubNavContainer>
    );
};

export default SubNav;
