import React, { FC, useContext, useEffect, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import Overview from '@components/Portfolio/Trading/Overview';
import Position from '@components/Portfolio/Trading/Position';
import MarginAccounts from '@components/Portfolio/Trading/MarginAccounts';
import TradeHistory from '@components/Portfolio/Trading/TradeHistory';
import Transfers from '@components/Portfolio/Trading/Transfers';
import { FactoryContext, initialFactoryState } from '@context/FactoryContext';

const TradingPortfolio: FC = () => {
    const { allFilledOrders, factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const [tab, setTab] = useState(0);
    const [fetchedTracers, setFetchedTracers] = useState<any>([]);

    const fetchTracers = setTimeout(async function getInfo() {
        const tempTracers = [];
        for (const key of Object.keys(tracers)) {
            tempTracers.push(tracers[key]);
        }
        setFetchedTracers(tempTracers);
    }, 1000);

    useEffect(() => {
        fetchTracers;
    });

    const tabs = ['Overview', 'Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return <Overview fetchedTracers={fetchedTracers} />;
            case 1:
                return <Position tracers={tracers} allFilledOrders={allFilledOrders ?? {}} />;
            case 2:
                return <MarginAccounts />;
            case 3:
                return <TradeHistory allFilledOrders={allFilledOrders ?? {}} />;
            case 4:
                return <Transfers />;
            default:
                return;
        }
    };
    return (
        <>
            <SubNav tabs={tabs} setTab={setTab} selected={tab} />
            {content()}
        </>
    );
};

export default TradingPortfolio;
