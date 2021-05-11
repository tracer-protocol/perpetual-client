import React, { useContext, useEffect, useState } from 'react';
import { SearchBar } from '@components/Nav';
import { SearchableTable } from '@components/Tables/SearchableTable';
import { TracerContext, InsuranceContext } from 'context';
import { useAllPools } from 'hooks/GraphHooks/Insurance';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { InsurancePoolInfo as InsurancePoolInfoType } from 'types';
import { toApproxCurrency } from '@libs/utils';

const parseData: (data: InsurancePoolInfoType[]) => string[][] = (data) => {
    return data.map((pool) => [
        pool.market, // marketId
        `${pool.health}%`, // health
        `${toApproxCurrency(pool.target ?? 0)}`, // target
        `${toApproxCurrency(pool.liquidity ?? 0)}`, // liquidity
        `${toApproxCurrency(pool.userBalance ?? 0)}`, // userShare
        `${toApproxCurrency(pool.apy ?? 0)}`, // apy of pool
    ]) as string[][];
};

const InsurancePoolsTable: React.FC<{
    handleClick: (tracerId: string) => void;
    pools: Record<string, InsurancePoolInfoType>;
}> = ({
    handleClick,
    pools,
}: {
    handleClick: (tracerId: string) => void;
    pools: Record<string, InsurancePoolInfoType>;
}) => {
    const headings = ['Trace', 'Health', 'Target Value', 'Liquidity', 'My Share', 'APY'];
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState<string[][]>([]);

    useEffect(() => {
        if (pools) {
            setRows(parseData(Object.values(pools)));
        }
    }, [pools]);

    return (
        <>
            <div className="w-3/4 mx-auto text-md">
                <div className="w-full text-center text-blue-100 font-bold text-2xl py-5">Insurance Pools</div>
                <div className="w-full">
                    <SearchBar cClasses={'h-10'} filter={filter} setFilter={setFilter} />
                    <SearchableTable
                        handleRowClick={handleClick}
                        rows={rows as string[][]}
                        filter={filter}
                        headings={headings}
                    />
                </div>
            </div>
        </>
    );
};


/**
 * Even though this data could come from props, the user needs to ensure all data
 *  is loaded on this page as if they reload or specifically come to this page to check on their assets/pool
 *
 */
const InsurancePortfolio: React.FC = () => {
    const { tracerId, setTracerId } = useContext(TracerContext);
    const { pools, poolInfo } = useContext(InsuranceContext);
    const { insurancePools } = useAllPools();

    console.debug(insurancePools, 'Insurance Graph data');

    const router = useRouter();
    const query = router.query;

    const handleClick = (tracerId: string) => {
        router.push({
            pathname: '/insurance',
            query: { tracer: tracerId.split('/').join('-') },
        });
    };

    useEffect(() => {
        if (query.tracer) {
            setTracerId
                ? setTracerId(query.tracer.toString().split('-').join('/'))
                : console.error('setTracerId not set');
        } else {
            setTracerId ? setTracerId('') : console.error('setTracerId not set');
        }
    }, [query]);

    // return tracerId ? (
    //     <div className="h-full px-12 pb-6 flex flex-col">
    //         <div className="my-4 w-full card flex flex-col">
    //             <InsurancePoolInfo tracer={tracerId} />
    //         </div>
    //         <div className="card h-full flex flex-col">
    //             <PoolContributors holdings={insurancePools[tracerId]?.holders} liquidity={poolInfo?.liquidity ?? 0} />
    //         </div>
    //     </div>
    // ) : 
    return (
        <div className="h-full w-full flex flex-col">
            <div className={`w-full h-full card flex flex-col`}>
            </div>
        </div>
    );
};

export default InsurancePortfolio;
