import React, { useContext } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TracerContext, InsuranceContext } from 'context';
import { InsurancePoolInfo as InsurancePoolInfoType } from 'types';
import PoolBar from './PoolBar';

export const InsurancePoolInfo: React.FC<{ tracer: string }> = ({ tracer }: { tracer: string }) => {
    const { tracerId } = useContext(TracerContext);
    const { poolInfo } = useContext(InsuranceContext);
    const { userBalance, liquidity, target } = poolInfo as InsurancePoolInfoType;
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