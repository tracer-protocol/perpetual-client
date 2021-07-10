import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@components/Portfolio';
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

const largeButton = {
    height: '32px',
    width: '145px',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    hoverFG: '#fff',
    hoverBG: 'var(--color-primary)',
    hoverCursor: 'pointer',
};

const SmallTitle = styled.h2`
    font-size: var(--font-size-medium);
    letter-spacing: -0.4px;
    color: var(--color-text);
    margin-bottom: 0.5rem;
    flex-basis: 100%
    width: fit-content;
    white-space: nowrap;
`;

interface EqProps {
    className?: string;
    selectedTracerAddress: string;
}
const Equity: FC<EqProps> = styled(({ selectedTracerAddress, className }: EqProps) => {
    const [show, setShow] = useState(false);
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
    };

    return (
        <div className={className}>
            <div className="flex justify-content-between">
                <SmallTitle>Equity</SmallTitle>
                <Button theme={largeButton} onClick={(e) => onClick(e)}>
                    {show ? 'Hide Breakdown' : 'Show Breakdown'}
                </Button>
            </div>
            <EqTable>
                <EqTableBody>
                    {/* First row */}
                    <EqTableRow>
                        <EqTableCellLarge>
                            <Amount color="#21DD53">
                                $44.3
                                <ProfitArrow direction="up"></ProfitArrow>
                            </Amount>
                            <Profit>
                                <ProfitAmount color="#21DD53">$130 (23%)</ProfitAmount>
                                <Text>All time</Text>
                            </Profit>
                            <Text>
                                <CellTitle>Equity</CellTitle>
                                <CellDesc>Over 4 open positions</CellDesc>
                            </Text>
                        </EqTableCellLarge>
                        <EqTableCell>
                            <Amount>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Deposited Margin</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCell>
                            <Amount>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Unrealised PnL</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCellLast>
                            <Amount>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Realised PnL</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Second row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty>
                        </EqTableCellLargeEmpty>
                        <EqTableCellEmpty>
                        </EqTableCellEmpty>
                        <EqTableCell>
                            <Amount small={true}>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Price Changes</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCellLast>
                            <Amount small={true}>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Price Changes</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Third row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty>
                        </EqTableCellLargeEmpty>
                        <EqTableCellEmpty>
                        </EqTableCellEmpty>
                        <EqTableCell>
                            <Amount small={true}>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Funding Rate</CellTitle>
                            </Text>
                        </EqTableCell>
                        <EqTableCellLast>
                            <Amount small={true}>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Funding Rate</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Fourth row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty>
                        </EqTableCellLargeEmpty>
                        <EqTableCellEmpty>
                        </EqTableCellEmpty>
                        <EqTableCellEmpty border={true}>
                        </EqTableCellEmpty>
                        <EqTableCellLast>
                            <Amount small={true}>
                                $0.45
                            </Amount>
                            <Text>
                                <CellTitle>Trading Fee</CellTitle>
                            </Text>
                        </EqTableCellLast>
                    </EqTableRow>
                    {/* Fifth row */}
                    <EqTableRow>
                        <EqTableCellLargeEmpty>
                        </EqTableCellLargeEmpty>
                        <EqTableCellEmpty>
                        </EqTableCellEmpty>
                        <EqTableCellEmpty border={true}>
                        </EqTableCellEmpty>
                        <EqTableCellLast>
                            <Amount small={true}>
                                $0.45
                            </Amount>
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
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 7px;
    padding: 10px;
    position: relative;
    background: #002886;
`;

export default Equity;
