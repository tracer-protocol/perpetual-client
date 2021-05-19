import React, { useState, useContext } from 'react';
import { PaginationTable } from '@components/Tables';
import { SearchBar } from '@components/Nav/SearchBar';
import { useAccountData } from '@hooks/GraphHooks/Account';
import { Web3Context } from '@context/Web3Context';
import Web3 from 'web3';
import { toApproxCurrency } from 'libs/utils';

type Trade = {
    id: string;
    timestamp: number;
    amount: string;
    order: {
        price: string;
        priceMultiplier: string;
        tracer: {
            marketId: string;
        };
    };
    position: boolean;
};
interface GraphData {
    trader: {
        id: string;
        trades: Trade[];
    };
}

function parseGraphData(data: GraphData) {
    const parseRows: string[][] = [];
    if (data?.trader?.trades.length) {
        for (const order of data.trader.trades) {
            parseRows.push([
                new Date(order.timestamp * 1000).toLocaleDateString('en-US'),
                order.id.split('-')[0],
                order.position ? 'LONG' : 'SHORT',
                toApproxCurrency((parseInt(order.order.price) * 100) / parseInt(order.order.priceMultiplier)),
                Web3.utils.fromWei(order.amount),
            ]);
        }
    }
    return parseRows;
}

const History: React.FC = () => {
    const { account } = useContext(Web3Context);
    const { userData, loading } = useAccountData(account);
    const parsedRows = parseGraphData(userData);
    const [filter, setFilter] = useState('');
    const headings = ['Date', 'Market', 'Position', 'Order Price', 'Amount'];
    const renderContent = () => {
        if (loading || parsedRows.length) {
            return (
                <PaginationTable
                    headings={headings}
                    loading={loading}
                    rows={
                        filter
                            ? parsedRows.filter((row) => row[1].toUpperCase().indexOf(filter.toUpperCase()) > -1)
                            : parsedRows
                    }
                />
            );
        } else {
            return <h2 className="text-center">No transactions found</h2>;
        }
    };

    return (
        <div className="h-full p-6 flex flex-col">
            <div className={`w-full h-full card flex flex-col`}>
                <div className="w-1/2 m-auto text-center text-blue-100 font-bold text-2xl pt-5">
                    Trade History
                    <span className="px-3 w-16">
                        <SearchBar filter={filter} setFilter={setFilter} />
                    </span>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default History;
