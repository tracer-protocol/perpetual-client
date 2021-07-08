import styled from 'styled-components';

export const Table = styled.table``;

export const TableHeader = styled.thead``;

export const TableHeading = styled.th`
    text-align: left;
    color: var(--color-primary);
    height: 40px;
    font-size: var(--font-size-extra-small);
    padding-left: 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
`;

export const TableLastHeading = styled(TableHeading)`
    border-right: none;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    transition: 0.5s;
    color: white;
    opacity: 1;

    &:hover {
        background: var(--color-accent);
        cursor: pointer;
    }
`;

export const TableCell = styled.td`
    padding: 0 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
`;

// Last cell on a table row
export const TableLastCell = styled(TableCell)`
    border-right: none;
`;
