import React, { useContext, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import Position from '@components/Portfolio/Trading/Position';
import MarginAccounts from '@components/Portfolio/Trading/MarginAccounts';
import TradeHistory from '@components/Portfolio/Trading/TradeHistory';
import Transfers from '@components/Portfolio/Trading/Transfers';
import { FactoryContext } from '@context/FactoryContext';
import BigNumber from 'bignumber.js';
import Tracer from '@libs/Tracer';

const defaultTracers = {
    'TSLA/USDC': {
        name: 'TSLA',
        marketId: 'TSLA-USDC',
        balances: {
            quote: new BigNumber(0),
            base: new BigNumber(0),
            tokenBalance: new BigNumber(0),
            totalLeveragedValue: 0,
            lastUpdatedGasPrice: 0,
        },
        maxLeverage: new BigNumber(1),
        oraclePrice: new BigNumber(0),
        quoteTokenDecimals: new BigNumber(1),
        amountToBuy: new BigNumber(0),
        feeRate: new BigNumber(0),
        fundingRateSensitivity: new BigNumber(0),
    } as unknown as Tracer
}

const TradingPortfolio: React.FC = () => {
    const { tracers } = useContext(FactoryContext);
    console.log(tracers, "Tracers")
    const [tab, setTab] = useState(0);
    const tabs = ['Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return <Position tracers={defaultTracers} />;
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
