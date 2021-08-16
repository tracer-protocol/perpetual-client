import styled from 'styled-components';

export const Table = styled.table``;

export const TableBody = styled.tbody``;

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

// Last heading on a row
export const TableLastHeading = styled(TableHeading)`
    border-right: none;
`;

export const TableCell = styled.td`
    padding: 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);

    .secondary {
        color: var(--color-secondary);
    }
`;

export const TableRow = styled.tr`
    opacity: 1;
    transition: 1300ms;

    &.hide {
        opacity: 0;
        visibility: collapse;
        transition: 300ms;

        ${TableCell} {
            border: none;
        }
    }

    &:hover {
        background: var(--color-accent);
        cursor: pointer;
    }

    &.selected {
        &:hover {
            background: none;
            cursor: auto;
        }
    }
`;

// Last cell on a row
export const TableLastCell = styled(TableCell)`
    border-right: none;
`;

interface STProps {
    bodyHeight: string;
}
export const ScrollableTable = styled.table<STProps>`
    ${TableBody} {
        display: block;
        max-height: ${(props) => `${props.bodyHeight}`};
        overflow-y: scroll;
    }

    ${TableHeader} {
        display: table;
        width: calc(100% - 7px);
        table-layout: fixed;
    }

    ${TableRow} {
        display: table;
        width: 100%;
        table-layout: fixed;
    }
`;

export const RecentTradesTable = styled.table`
    ${TableHeading} {
        border: none;
        color: var(--color-text);
        font-size: var(--font-size-small);
    }

    ${TableCell} {
        border: none;
    }
`;
