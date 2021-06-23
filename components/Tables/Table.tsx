import React, { MouseEvent } from 'react';
import { Children } from 'types';

type TProps = {
    headings: string[];
    squared?: boolean;
    compact?: boolean;
} & Children;

type RProps = {
    rowData: string[];
    onClick: (event: MouseEvent) => void;
    rowSelected: boolean;
    squared?: boolean; // default center
    compact?: boolean;
} & Children;

export const TableRow: React.FC<RProps> = ({
    rowData,
    compact,
    onClick,
    children,
    rowSelected,
    squared,
}: RProps) => {
    return (
        <tr
            onClick={onClick}
            className={`cRow ${rowSelected ? 'bg-blue-300' : 'bg-white'}`}
        >
            {rowData.map((cell, index) => {
                const alignment = squared
                    ? index === 0
                        ? 'left'
                        : index === rowData.length - 1
                        ? 'right'
                        : 'center'
                    : 'center';
                return (
                    <td
                        key={`cell-${index}`}
                        className={`${
                            compact ? 'p-1' : 'p-3'
                        } text-${alignment}`}
                    >
                        {cell}
                    </td>
                );
            })}
            {children}
        </tr>
    );
};

const Table: React.FC<TProps> = ({
    headings,
    squared,
    compact,
    children,
}: TProps) => {
    return (
        <table className={`table-auto w-full text-center`}>
            <thead className="border-b-2 border-blue-300">
                <tr className="text-blue-100 font-bold w-full">
                    {headings.map((heading, index) => {
                        const alignment = squared
                            ? index === 0
                                ? 'left'
                                : index === headings.length - 1
                                ? 'right'
                                : 'center'
                            : 'center';
                        return (
                            <td
                                key={`hCell-${index}`}
                                className={`${
                                    compact ? 'pb-2 px-2 ' : 'pb-5 px-3 '
                                } text-${alignment}`}
                            >
                                {heading}
                            </td>
                        );
                    })}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
};

export default Table;
