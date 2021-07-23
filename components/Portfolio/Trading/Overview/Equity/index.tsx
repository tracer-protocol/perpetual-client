import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { SmallTitle } from '@components/Portfolio';
import { UserBalance } from '@libs/types/TracerTypes';
import { BigNumber } from 'bignumber.js';
import {
    EqTableRow,
    EqTableCell,
    EqTableCellLarge,
    EqTableCellLargeEmpty,
    EqTableCellEmpty,
    EqTable,
    EqTableBody,
    EqTableCellLast,
    Profit,
    ProfitArrow,
    ProfitAmount,
    Amount,
    Text,
    CellTitle,
    CellDesc,
} from './EqTable';
import { Button } from '@components/General';

const ToggleTable = () => {
    const tableEl = document.querySelector<HTMLElement>('.equityStats');
    if (tableEl) {
        tableEl.classList.toggle('show');
    }
};

interface EqProps {
    className?: string;
    balances: UserBalance;
    fairPrice: BigNumber;
    baseTicker: string;
    quoteTicker: string;
}
const Equity: FC<EqProps> = styled(({ className }: EqProps) => {
    const [show, setShow] = useState(false);
    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
        ToggleTable();
    };

    return (
        <div className={className}>
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
                                -
                                <ProfitArrow direction="none" />
                            </Amount>
                            <Profit>
                                <ProfitAmount color="#21DD53">
                                    <span>$0</span> (0%)
                                </ProfitAmount>
                                <Text>All time</Text>
                            </Profit>
                            <Text>
                                <CellTitle>Equity</CellTitle>
                                <CellDesc>Over 0 open positions</CellDesc>
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
    max-height: 120px;
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
`;

export default Equity;
