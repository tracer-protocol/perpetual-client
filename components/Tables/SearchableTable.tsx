import React, { useContext } from 'react';
import { TracerContext } from 'context';
import Table, { TableRow } from './';

interface STProps {
    rows: string[][];
    filter: string;
    headings: string[];
    handleRowClick?: (tracerId: string) => void;
    compact?: boolean;
    cClasses?: string;
}

export const SearchableTable: React.FC<STProps> = ({
    rows,
    compact,
    filter,
    headings,
    handleRowClick,
    cClasses,
}: STProps) => {
    const { tracerId } = useContext(TracerContext);

    return (
        <>
            <div className={`${compact ? 'my-2' : 'my-8'} ${cClasses ? cClasses : ''}`}>
                <Table compact={compact} squared headings={headings}>
                    {rows.map((row, _index) => {
                        if (filter) {
                            if (row[0].toUpperCase().indexOf(filter.toUpperCase()) > -1) {
                                return (
                                    <TableRow
                                        compact={compact}
                                        squared
                                        rowSelected={tracerId === row[0]}
                                        onClick={() => (handleRowClick ? handleRowClick(row[0]) : false)}
                                        rowData={row}
                                    />
                                );
                            }
                        } else {
                            return (
                                <TableRow
                                    compact={compact}
                                    squared
                                    rowSelected={tracerId === row[0]}
                                    onClick={() => (handleRowClick ? handleRowClick(row[0]) : false)}
                                    rowData={row}
                                />
                            );
                        }
                    })}
                </Table>
            </div>
        </>
    );
};
