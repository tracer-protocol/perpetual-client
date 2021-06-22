import React from 'react';
import styled from 'styled-components';
import { Children } from 'types';

type TProps = {
    headings: string[];
    className?: string;
} & Children;

export const Table: React.FC<TProps> = styled(({ headings, children, className }: TProps) => {
    return (
        <table className={className}>
            <THead>
                {headings.map((heading: string) => (
                    <th key={`${heading}-heading`}>{heading}</th>
                ))}
            </THead>
            {children}
        </table>
    );
})`
    width: 100%;
    max-height: 100%;
    overflow: scroll;
`;

export const THead = styled.thead`
    color: var(--color-primary);
    font-size: 16px;
    letter-spacing: -0.32px;
    text-align: left;
    > th {
        padding: 0.7rem 0.5rem;
        border-bottom: 1px solid #002886;
        border-right: 1px solid #002886;
        font-weight: normal;
    }
`;

export const TRow = styled.tr`
    letter-spacing: -0.4px;
    color: #ffffff;
    font-size: 14px;
`;

export const TData = styled.td`
    padding: 0.5rem;
    border-bottom: 1px solid #002886;
    border-right: 1px solid #002886;
`;
