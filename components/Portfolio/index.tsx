import styled from 'styled-components';

export const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    border: 1px solid #0c3586;
`;

export const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-bottom: 1px solid #0c3586;
`;

export const SmallTitle = styled.h2`
    font-size: var(--font-size-medium);
    letter-spacing: var(--letter-spacing-extra-small);
    color: var(--color-text);
    flex-basis: 100%;
    width: fit-content;
    white-space: nowrap;
`;

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

    &.selected {
        &:hover {
            background: none;
            cursor: auto;
        }
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

export const SecondaryCell = styled.div`
    color: var(--color-secondary);
    font-size: var(--font-size-small);
`;

export const StatusIndicator = styled.div<{
    color: string;
}>`
    color: ${(props) => props.color};
`;

export function getStatusColour(status: string): string {
    let colour = '#fff';
    if (status === 'Eligible for Liquidation') {
        colour = '#F15025';
    } else if (status === 'Approaching Liquidation') {
        colour = '#F4AB57';
    }
    return colour;
}
