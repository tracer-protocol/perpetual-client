import React, { useContext, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SideNav from '@components/Nav/SideNav';
import TradingPortfolio from '@components/Portfolio/Trading';
import InsurancePortfolio from '@components/Portfolio/Insurance';
import { LeftPanel, RightPanel } from '@components/Portfolio';
import Footer from '@components/Footer';
import { FactoryContext, initialFactoryState } from '@context/FactoryContext';

export default styled(({ className }) => {
    const [tab, setTab] = useState(0);
    const tabs = ['Trading Portfolio', 'Insurance Portfolio'];
    const { allFilledOrders, factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const content = () => {
        switch (tab) {
            case 0:
                return <TradingPortfolio allFilledOrders={allFilledOrders ?? {}} tracers={tracers} />;
            case 1:
                return <InsurancePortfolio tracers={tracers} />;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <NavBar />
            <div className="container flex">
                <LeftPanel>
                    <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                </LeftPanel>
                <RightPanel>{content()}</RightPanel>
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
