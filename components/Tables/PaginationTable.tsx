import React, { useState } from 'react';
import TracerLoading from '@components/TracerLoading';
import Table, { TableRow } from './Table';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface PProps {
    page: number;
    totalPages: number;
    setPage: (number: number) => void;
}

const pageButton = 'mx-1 px-3 py-2 bg-white text-blue-100 hover:bg-gray-100 rounded-lg cursor-pointer';
const Pagination: React.FC<PProps> = ({ page, totalPages, setPage }: PProps) => {
    const menu = [];
    if (totalPages > 3 && page >= 2) {
        menu.push(
            <li className="flex font-bold">
                <div className="m-auto text-center px-3 text-blue-100">...</div>
            </li>,
        );
    }
    if (page === 0) {
        for (let i = 0; i < 3; i++) {
            menu.push(
                <li onClick={() => setPage(i)} className={`${pageButton} ${i === page ? 'font-bold' : 'font-normal'}`}>
                    <div className="">{i}</div>
                </li>,
            );
        }
    } else if (page === totalPages - 1) {
        for (let i = totalPages - 3; i < totalPages; i++) {
            menu.push(
                <li onClick={() => setPage(i)} className={`${pageButton} ${i === page ? 'font-bold' : 'font-normal'}`}>
                    <div className="">{i}</div>
                </li>,
            );
        }
    } else {
        for (let i = page - 1; i <= page + 1; i++) {
            menu.push(
                <li onClick={() => setPage(i)} className={`${pageButton} ${i === page ? 'font-bold' : 'font-normal'}`}>
                    <div className="">{i}</div>
                </li>,
            );
        }
    }
    if (totalPages > 3 && page < totalPages - 2) {
        menu.push(
            <li className="flex font-bold">
                <div className="m-auto text-center px-3 text-blue-100">...</div>
            </li>,
        );
    }

    return (
        <div className="m-auto flex flex-row">
            <ul className="flex m-auto">
                <li>
                    {page === 0 ? (
                        <LeftOutlined color={'#d5d5d5'} className={'m-auto mx-3 inline-block'} />
                    ) : (
                        <span
                            className="hover:bg-gray-100 rounded-lg font-bold cursor-pointer flex"
                            onClick={() => setPage(page - 1)}
                        >
                            <LeftOutlined color={'#0000bd'} className={'m-auto mx-3 inline-block'} />
                        </span>
                    )}
                </li>
                {menu}
                <li>
                    {page === totalPages - 1 ? (
                        <RightOutlined color={'#d5d5d5'} className={'m-auto mx-3 inline-block'} />
                    ) : (
                        <span
                            className="hover:bg-gray-100 rounded-lg font-bold cursor-pointer flex"
                            onClick={() => setPage(page + 1)}
                        >
                            <RightOutlined color={'#0000bd'} className={'m-auto mx-3 inline-block'} />
                        </span>
                    )}
                </li>
            </ul>
        </div>
    );
};

interface PTProps {
    headings: string[];
    rows?: string[][];
    loading?: boolean;
}

export const PaginationTable: React.FC<PTProps> = ({ loading, headings, rows }: PTProps) => {
    const [page, setPage] = useState(0);
    return (
        <>
            <div className="py-6">
                {loading ? (
                    <TracerLoading />
                ) : (
                    <Table headings={headings}>
                        {rows?.slice(page * 10, page * 10 + 10).map((row, index) => {
                            return (
                                <TableRow key={`row-${index}`} onClick={() => null} rowSelected={false} rowData={row} />
                            );
                        })}
                    </Table>
                )}
            </div>
            <div className="mt-auto pb-6">
                <Pagination page={page} setPage={setPage} totalPages={Math.ceil(rows?.length ?? 0 / 10)} />
            </div>
        </>
    );
};
