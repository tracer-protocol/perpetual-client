import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SearchableTable } from '@components/Tables/SearchableTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SearchBar } from '@components/Nav/SearchBar';
import { useAllPools } from '@hooks/GraphHooks/Insurance';
import { TracerContext, InsuranceContext } from 'context';
import { InsurancePoolInfo as InsurancePoolInfoType } from 'types';
import PoolBar from './PoolBar';
import PoolContributors from './PoolContributors';
import { toApproxCurrency } from '@components/libs/utils';

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

const InsurancePoolInfo: React.FC<{ tracer: string }> = ({ tracer }: { tracer: string }) => {
    const { tracerId } = useContext(TracerContext);
    const { poolInfo } = useContext(InsuranceContext);
    const { userBalance, liquidity, target } = poolInfo as InsurancePoolInfoType;
    console.debug(poolInfo, 'Insurance Pool Data');
    return (
        <>
            <div className="w-full text-center text-blue-100 border-gray-100 border-b-2 font-bold text-2xl py-5">
                <div className="absolute text-sm pl-6 font-normal">
                    <Link href="/insurance">
                        <button className="p-2 button-grow border-2 border-blue-100 text-blue-100 rounded-lg">
                            <FontAwesomeIcon
                                className="h-4 mx-3 inline-block"
                                size="sm"
                                color="#0000bd"
                                icon={faArrowLeft}
                            />
                            All pools
                        </button>
                    </Link>
                </div>
                {tracer} Insurance Pool
            </div>
            <div className="flex h-full">
                <div className="w-1/2 border-r-2 h-full flex border-gray-100">
                    <PoolBar
                        userBalance={userBalance ?? 0}
                        market={tracerId ?? ''}
                        liquidity={liquidity ?? 0}
                        target={target ?? 0}
                        rewards={0}
                        apy={0}
                        health={0}
                    />
                </div>
                <div className="w-1/2 flex">
                    <div className="w-1/2 border-r-2 border-gray-100 text-center flex">
                        <div className="m-auto">
                            <h1 className="text-blue-100 text-3xl">4.6% p.a</h1>
                            <div className="text-xl">Current insurer rewards</div>
                        </div>
                    </div>
                    <div className="w-1/2 text-center flex">
                        <div className="m-auto">
                            <h1 className="text-blue-100 text-3xl">
                                {poolInfo?.rewards} {tracer?.split('/')[1]}
                            </h1>
                            <div className="text-xl">Total rewards paid to contributors</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
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
const Insurance: React.FC = () => {
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

    return tracerId ? (
        <div className="h-full px-12 pb-6 flex flex-col">
            <div className="my-4 w-full card flex flex-col">
                <InsurancePoolInfo tracer={tracerId} />
            </div>
            <div className="card h-full flex flex-col">
                <PoolContributors holdings={insurancePools[tracerId]?.holders} liquidity={poolInfo?.liquidity ?? 0} />
            </div>
        </div>
    ) : (
        <div className="h-full w-full p-12 flex flex-col">
            <div className={`w-full h-full card flex flex-col`}>
                <InsurancePoolsTable pools={pools ?? {}} handleClick={handleClick} />
            </div>
        </div>
    );
};

export default Insurance;
