import React, { FC, useContext, useEffect, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import Overview from '@components/Portfolio/Trading/Overview';
import Position from '@components/Portfolio/Trading/Position';
import MarginAccounts from '@components/Portfolio/Trading/MarginAccounts';
import TradeHistory from '@components/Portfolio/Trading/TradeHistory';
import Transfers from '@components/Portfolio/Trading/Transfers';
import { FactoryContext, initialFactoryState } from '@context/FactoryContext';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';

const TradingPortfolio: FC = () => {
    const { allFilledOrders, factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const [tab, setTab] = useState(0);
    const [positions, setPositions] = useState<Tracer[]>([]);
    const [holdings, setHoldings] = useState<Tracer[]>([]);

    // fetch all tracers where the user has an open position
    useEffect(() => {
        const positions: Tracer[] = [];
        const holdings: Tracer[] = [];

        Object.values(tracers).map((tracer) => {
            const balance = tracer?.getBalance() ?? defaults.balances;
            if (!balance.quote.eq(0)) {
                // if the user has deposited
                holdings.push(tracer);
            }
            if (!balance.base.eq(0)) {
                // if the user has a position
                positions.push(tracer);
            }
        });
        setPositions(positions);
        setHoldings(holdings);
    }, [tracers]);

    const tabs = ['Overview', 'Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return <Overview positions={positions} holdings={holdings} />;
            case 1:
                return <Position tracers={tracers} allFilledOrders={allFilledOrders ?? {}} />;
            case 2:
                return <MarginAccounts tracers={Object.values(tracers)} />;
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
            <Content>{content()}</Content>
        </>
    );
};

export default TradingPortfolio;

const Content = styled.div`
    overflow: auto;
    height: 100%;
`;
