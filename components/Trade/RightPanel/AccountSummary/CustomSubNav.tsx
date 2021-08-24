import React, { FC } from 'react';
import { SubNavContainer, SubNavItem } from '@components/Nav/SubNav';
import styled from 'styled-components';

const StyledSubNavContainer = styled(SubNavContainer)`
    height: var(--height-extra-small-container);
    ${SubNavItem} {
        height: var(--height-extra-small-container);
    }
`;

type TEProps = {
    amount: number;
    className?: string;
};
const TableEntries: React.FC<TEProps> = styled(({ amount, className }: TEProps) => (
    <span className={className}>{amount}</span>
))`
    background: var(--color-secondary);
    color: var(--color-background);
    border-radius: 20px;
    text-align: center;
    padding: 0 12px;
    margin: 5px;
    font-size: var(--font-size-small);
`;
type CSNProps = {
    selected: number;
    setTab: (id: number) => void;
    fills: number;
    orders: number;
};
const CustomSubNav: FC<CSNProps> = ({ setTab, selected, fills, orders }: CSNProps) => (
    <StyledSubNavContainer>
        <SubNavItem
            className={`${0 === selected ? 'selected' : ''} flex`}
            key={'sub-nav-positions'}
            onClick={(e) => {
                e.preventDefault();
                setTab(0);
            }}
        >
            <div className="m-auto">{'Position'}</div>
        </SubNavItem>
        <SubNavItem
            className={`${1 === selected ? 'selected' : ''} flex`}
            key={'sub-nav-orders'}
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
            key={'sub-nav-fills'}
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
    </StyledSubNavContainer>
);

export default CustomSubNav;
