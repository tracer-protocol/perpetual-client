import React, { useContext, useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SideNav from '@components/Nav/SideNav';
import TradingPortfolio from '@components/Portfolio/Trading';
import InsurancePortfolio from '@components/Portfolio/Insurance';
import { LeftPanel, RightPanel } from '@components/Portfolio';
import Footer from '@components/Footer';
import { FactoryContext, initialFactoryState } from '@context/FactoryContext';
import Tracer from '@libs/Tracer';
import { InsuranceStore } from '@context/InsuranceContext';

export default styled(({ className }) => {
    const [tab, setTab] = useState(0);
    const tabs = ['Trading Portfolio', 'Insurance Portfolio'];
    const { allFilledOrders, factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const [fetchedTracers, setFetchedTracers] = useState<Tracer[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setFetchedTracers(Object.values(tracers));
        }, 1000);
    }, [tracers]);

    const content = () => {
        switch (tab) {
            case 0:
                return <TradingPortfolio allFilledOrders={allFilledOrders ?? {}} tracers={fetchedTracers} />;
            case 1:
                return <InsurancePortfolio tracers={fetchedTracers} />;
            default:
                return;
        }
    };

    return (
        <div className={className}>
            <NavBar />
            <div className="container flex">
                <InsuranceStore>
                    <LeftPanel>
                        <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                    </LeftPanel>
                    <RightPanel>{content()}</RightPanel>
                </InsuranceStore>
            </div>
            <Footer />
        </div>
    );
})`
    min-height: 100vh;
    flex-direction: column;
    background-color: var(--color-background);
    color: var(--color-text);
`;
