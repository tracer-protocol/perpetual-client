import styled from 'styled-components';
// @ts-ignore
// import profit_arrow_up from 'public/img/general/triangle_up_green.svg';
// import profit_arrow_down from 'public/img/general/triangle_down_red.svg';

export const PGContainer = styled.table`
    width: 100%;
`;

export const TableBody = styled.tbody``;

export const Row = styled.tr`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    color: white;
    border-bottom: 1px solid var(--table-semidarkborder);
`;

interface HCellProps {
    borderRight?: boolean;
}
export const HeadingCell = styled.td<HCellProps>`
    padding: 8px 16px;
    font-size: var(--font-size-large);
    flex-basis: 50%;
    border-right: 1px solid var(--table-semidarkborder);
`;

interface ICellProps {
    inner?: boolean;
}
export const InfoCell = styled.td<ICellProps>`
    padding: 8px 8px 8px 16px;
    flex-basis: 33.3333%;
    border-right: 1px solid var(--table-semidarkborder);
    padding: ${(props) => (props.inner ? '8px' : '8px 8px 8px 16px')};
`;

interface AmountProps {
    small?: boolean;
}
export const Amount = styled.span<AmountProps>`
    display: flex;
    align-items: flex-start;
    flex-basis: auto;
    font-size: ${(props) => (props.small ? 'var(--font-size-medium)' : 'var(--font-size-large)')};
    line-height: ${(props) => (props.small ? 'var(--font-size-medium)' : 'var(--font-size-large)')};
    whitespace: no-wrap;
`;

export const CellTitle = styled.span`
    flex-basis: 100%;
    color: #3da8f5;
    margin-top: 2px;
    font-size: var(--font-size-extra-small);
`;

interface SDotProps {
    type?: string;
}
export const StatusDot = styled.span<SDotProps>`
    display: inline-block;
    width: 18px;
    height: 7px;
    border-radius: 10px;
    margin-right: 5px;
    background-color: ${(props) => props.type && (('var(--' + props.type) as string) + ')'};
`;

interface BcellProps {
    inner?: boolean;
}
export const BorderlessCell = styled.td<BcellProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-basis: 50%;
    padding: ${(props) => (props.inner ? '8px' : '8px 8px 8px 16px')};
`;
