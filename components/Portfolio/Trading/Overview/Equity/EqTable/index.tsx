import styled from 'styled-components';

export const EqTable = styled.table`
    width: 100%;
    backface-visibility: hidden;

    td {
        transition: opacity 0.5s ease, border 0.5s ease;
    }

    // Remove border from first row of td cells
    // and add it to the first row instead for
    // even border spacing across cells
    tr:first-of-type td {
        border-top: unset;
        border-bottom: unset;
    }

    // Replace the missing border on the third
    // td cell in first row
    tr:first-of-type td:nth-child(3) {
        border-bottom: 1px solid var(--table-darkborder);
    }
    tr:first-of-type {
        border-top: 1px solid var(--table-darkborder);
        border-bottom: 1px solid var(--table-darkborder);
    }

    // Fade out rows 2-5 when 'Hide Breakdown' clicked
    tr:nth-child(2) td,
    tr:nth-child(3) td,
    tr:nth-child(4) td,
    tr:nth-child(5) td {
        opacity: 0;
        border-color: transparent;
    }
`;

export const EqTableHeader = styled.thead``;

export const EqTableBody = styled.tbody``;

export const EqTableRow = styled.tr`
    transition: 0.5s;
    color: white;
    opacity: 1;

    &:hover {
        background: var(--color-accent);
        cursor: pointer;
    }
`;

export const EqTableCellLarge = styled.td`
    display: inline-flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 235px;
    overflow: hidden;
    padding: 8px 16px;
    border-bottom: 1px solid var(--table-darkborder);
    border-top: 1px solid var(--table-darkborder);
`;

export const EqTableCellLargeEmpty = styled.td`
    width: 235px;
`;

export const EqTableCell = styled.td`
    padding: 8px 16px;
    width: 135px;
    border-left: 1px solid var(--table-darkborder);
    border-top: 1px solid var(--table-darkborder);
    border-bottom: 1px solid var(--table-darkborder);
`;

// Last cell on a EqTable row
export const EqTableCellLast = styled.td`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 8px 16px;
    border-left: 1px solid var(--table-darkborder);
    border-bottom: 1px solid var(--table-darkborder);
`;

interface TBCellProps {
    border?: boolean;
}
export const EqTableCellEmpty = styled.td<TBCellProps>`
    width: 135px;
    ${(props) =>
        props.border
            ? 'border-bottom: 1px solid var(--table-darkborder);\
               border-left: 1px solid var(--table-darkborder);'
            : 'border: none;'}
`;

interface AmountProps {
    color?: string;
    small?: boolean;
}
export const Amount = styled.span<AmountProps>`
    display: flex;
    align-items: flex-start;
    flex-basis: auto;
    color: ${(props) => (props.color ? (props.color as string) : '#ffffff')};
    font-size: ${(props) => (props.small ? 'var(--font-size-medium)' : 'var(--font-size-xlarge)')};
    line-height: ${(props) => (props.small ? 'var(--font-size-medium)' : 'var(--font-size-xlarge)')};
`;

export const Profit = styled.span`
    font-size: 12px;
    flex-basis: auto;
    padding-left: 5px;
`;

export const ProfitArrow = styled.span<{ direction: string }>`
    ${(props) => props.direction === 'up' && 'background-image: url(/img/general/triangle_up_green.png);'}
    ${(props) => props.direction === 'down' && 'background-image: url(/img/general/triangle_down_red.png);'}
    width: 14px;
    height: 14px;
    background-size: cover;
    margin-left: 5px;
    position: relative;
    &:after {
        ${(props) => props.direction === 'none' && 'content: "-";'}
        position: absolute;
        top: 0;
        left: 3px;
        font-size: 14px;
        line-height: 9px;
        color: #fff;
        font-weight: bold;
    }
`;

export const ProfitAmount = styled.span<{ color: string }>`
    color: ${(props) => props.color};
`;

export const Text = styled.p`
    flex-basis: 100%;
    text-align: left;
    font-size: 12px;
    color: #3da8f5;
`;

export const CellTitle = styled.span`
    color: #3da8f5;
`;

export const CellDesc = styled.span`
    color: #005ea4;
    margin-left: 5px;
`;
