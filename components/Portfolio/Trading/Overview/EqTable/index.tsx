import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { SmallTitle } from '@components/Portfolio';
import { Button } from '@components/General';
import Tracer, { defaults } from '@libs/Tracer';
import { toApproxCurrency } from '@libs/utils';

interface ETProps {
    className?: string;
    holdings: Tracer[];
    currentPortfolio: number;
}
const EquityTable = styled(({ className, holdings, currentPortfolio }: ETProps) => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
        ref.current?.classList.toggle('show');
    };

    const balances = holdings[currentPortfolio]?.getBalance() ?? defaults.balances;

    return (
        <div ref={ref} className={className}>
            <div className="flex justify-content-between heading-row">
                <SmallTitle>Equity</SmallTitle>
                <Button onClick={(e: any) => onClick(e)}>{show ? 'Hide Breakdown' : 'Show Breakdown'}</Button>
            </div>
            <EqTable>
                <EqTableBody>
                    {/* First row */}
                    <EqTableRow>
                        <EqTableCellLarge>
                            <Amount color="#21DD53">
                                {balances.quote.eq(0) ? '-' : `${toApproxCurrency(balances.totalMargin)}`}
                                <ProfitArrow direction="none" />
                            </Amount>
                            <Profit>
                                <ProfitAmount color="#21DD53">
                                    <span>$0</span> (0%)
                                </ProfitAmount>
                                {/*<Text>All time</Text>*/}
                            </Profit>
                            <Text>
                                {/*<CellTitle>Equity</CellTitle>*/}
                                {/*<CellDesc>Over {holdings.length} open positions</CellDesc>*/}
                            </Text>
                        </EqTableCellLarge>
                        <EqTableCell>
                            <Amount>-</Amount>
                            <Text>
                                <CellTitle>Deposited Margin</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCell>
                            <Amount>-</Amount>
                            <Text>
                                <CellTitle>Unrealised PnL</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCellLast>
                            <Amount>-</Amount>
                            <Text>
                                <CellTitle>Realised PnL</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Second row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty />
                        <EqTableCellEmpty />
                        <EqTableCell>
                            <Amount small>-</Amount>
                            <Text>
                                <CellTitle>Price Changes</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCellLast>
                            <Amount small>-</Amount>
                            <Text>
                                <CellTitle>Price Changes</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Third row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty />
                        <EqTableCellEmpty />
                        <EqTableCell>
                            <Amount small>-</Amount>
                            <Text>
                                <CellTitle>Funding Rate</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCellLast>
                            <Amount small>-</Amount>
                            <Text>
                                <CellTitle>Funding Rate</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Fourth row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty />
                        <EqTableCellEmpty />
                        <EqTableCellEmpty border />
                        <EqTableCellLast>
                            <Amount small>-</Amount>
                            <Text>
                                <CellTitle>Trading Fee</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Fifth row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty />
                        <EqTableCellEmpty />
                        <EqTableCellEmpty border />
                        <EqTableCellLast>
                            <Amount small>-</Amount>
                            <Text>
                                <CellTitle>Insurance Funding Rate</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                </EqTableBody>
            </EqTable>
        </div>
    );
})`
    max-height: 130px;
    width: 100%;
    overflow: hidden;
    border-radius: 7px;
    position: relative;
    background: #002886;
    transition: max-height 0.5s ease;

    .heading-row {
        padding: 8px 16px 8px;
    }

    // Remove borders from last row of td elements
    table tr:last-of-type td {
    }
    table tr:last-of-type td {
        border-bottom: 0;
    }
    &.show {
        max-height: 420px;
        tr:nth-child(2) td,
        tr:nth-child(3) td,
        tr:nth-child(4) td,
        tr:nth-child(5) td {
            opacity: 1;
            border-color: var(--table-darkborder);
        }
    }
`;

export default EquityTable;

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
