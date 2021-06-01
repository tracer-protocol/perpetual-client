import React, { useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import Position from '@components/Portfolio/Trading/Position';
import MarginAccounts from '@components/Portfolio/Trading/MarginAccounts';
import TradeHistory from '@components/Portfolio/Trading/TradeHistory';
import Transfers from '@components/Portfolio/Trading/Transfers';

const TradingPortfolio: React.FC = () => {
    const [tab, setTab] = useState(0);
    const tabs = ['Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return <Position />;
            case 1:
                return <MarginAccounts />;
            case 2:
                return <TradeHistory />;
            case 3:
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
