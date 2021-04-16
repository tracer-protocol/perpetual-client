import React, { useContext } from 'react';
import PositionTable from './LivePositionTable';
import { TracerContext } from '@context/TracerContext';
import { MarketInfo, AccountMarginInfo, PnLInfo } from '@components/SummaryInfo';

import { Children } from 'types';
import { MarginButtons } from '@components/Buttons';

import { FactoryContext } from 'context';

export const PositionsContext = React.createContext(null);

type CProps = {
    classes?: string;
    title?: string;
} & Children;

const Card: React.FC<CProps> = ({ title, classes, children }: CProps) => {
    return (
        <div className={`w-1/3 h-full card ${classes}`}>
            <div className="p-5 h-full text-center flex flex-col">
                <h1 className="text-lg font-bold text-blue-100">{title}</h1>
                {children}
            </div>
        </div>
    );
};

const LivePositions: React.FC = () => {
    const { tracerId, selectedTracer } = useContext(TracerContext);
    const { tracers } = useContext(FactoryContext);

    return (
        <div className="h-full px-12 flex flex-col">
            <div className={`my-4 w-full h-screen/40 card`}>
                <PositionTable tracers={tracers ?? {}} />
            </div>
            <div className="w-full h-screen/40 flex mt-auto">
                <Card title={`${tracerId} Market Details`}>
                    <MarketInfo fundingRate={selectedTracer?.feeRate ?? 0} />
                </Card>
                <Card title={`My ${tracerId} Margin Account`} classes={`mx-12 flex flex-col card`}>
                    <AccountMarginInfo 
                        balance={selectedTracer?.balances} 
                        fairPrice={(selectedTracer?.oraclePrice ?? 0) / (selectedTracer?.priceMultiplier ?? 0)}
                        maxLeverage={selectedTracer?.maxLeverage ?? 1}
                    />
                    <div className="mt-auto">
                        <MarginButtons />
                    </div>
                </Card>
                <Card title={`My ${tracerId} PnL`}>
                    <PnLInfo />
                </Card>
            </div>
        </div>
    );
};

export default LivePositions;
