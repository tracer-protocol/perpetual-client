import React from 'react';
import { SubNavContainer, SubNavItem } from '@components/Nav/SubNav';
import styled from 'styled-components';

type TEProps = {
    amount: number;
    className?: string;
};
const TableEntries: React.FC<TEProps> = styled(({ amount, className }: TEProps) => (
    <span className={className}>{amount}</span>
))`
    background: #005ea4;
    color: var(--color-background);
    border-radius: 20px;
    text-align: center;
    padding: 5px 15px;
    margin: 5px;
    font-size: var(--font-size-small);
`;
type CSNProps = {
    selected: number;
    setTab: (id: number) => void;
    fills: number;
    orders: number;
};
const CustomSubNav: React.FC<CSNProps> = ({ setTab, selected, fills, orders }: CSNProps) => (
    <SubNavContainer>
        <SubNavItem
            className={`${0 === selected ? 'selected' : ''} flex`}
            key={`sub-nav-positions`}
            onClick={(e) => {
                e.preventDefault();
                setTab(0);
            }}
        >
            <div className="m-auto">
                {'Position'}
            </div>
        </SubNavItem>
        <SubNavItem
            className={`${1 === selected ? 'selected' : ''} flex`}
            key={`sub-nav-orders`}
            onClick={(e) => {
                e.preventDefault();
                setTab(1);
            }}
        >   
            <div className="m-auto">
                {'Orders'}
                <TableEntries amount={orders} />
            </div>
        </SubNavItem>
        <SubNavItem
            className={`${2 === selected ? 'selected' : ''} flex`}
            key={`sub-nav-fills`}
            onClick={(e) => {
                e.preventDefault();
                setTab(2);
            }}
        >
            <div className="m-auto">
                {'Fills'}
                <TableEntries amount={fills} />
            </div>
        </SubNavItem>
    </SubNavContainer>
);

export default CustomSubNav;
