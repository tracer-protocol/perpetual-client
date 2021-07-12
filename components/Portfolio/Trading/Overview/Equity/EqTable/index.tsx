import styled from 'styled-components';
// @ts-ignore
import profit_arrow_up from 'public/img/general/triangle_up_green.svg';
// import profit_arrow_down from 'public/img/general/triangle_down_red.svg';

export const EqTable = styled.table`
    margin: 10px -20px 0px;
    width: calc(100% + 40px);
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
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 235px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--table-darkborder);
    border-top: 1px solid var(--table-darkborder);
`;

export const EqTableCellLargeEmpty = styled.td`
    width: 235px;
`;

export const EqTableCell = styled.td`
    padding: 0 10px;
    width: 135px;
    border-left: 1px solid var(--table-darkborder);
    border-top: 1px solid var(--table-darkborder);
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

// Last cell on a EqTable row
export const EqTableCellLast = styled.td`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 20px;
    border-top: 1px solid var(--table-darkborder);
    border-left: 1px solid var(--table-darkborder);
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
    ${(props) =>
        props.direction
            ? 'background-image: url(/img/general/triangle_up_green.png);'
            : 'background-image: url(/img/general/triangle_down_red.png);'}
    width: 14px;
    height: 14px;
    background-size: cover;
    margin-left: 5px;
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
