import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SideNav from '@components/Nav/SideNav';
import TradingPortfolio from '@components/Portfolio/Trading';
import InsurancePortfolio from '@components/Portfolio/Insurance';
import { LeftPanel, RightPanel } from '@components/Portfolio';
import Footer from '@components/Footer';
import { InsuranceStore } from '@context/InsuranceContext';
import { SelectedTracerStore } from '@context/TracerContext';

export default styled(({ className }) => {
    const [tab, setTab] = useState(0);
    const tabs = ['Trading Portfolio', 'Insurance Portfolio'];
    const content = () => {
        switch (tab) {
            case 0:
                return <TradingPortfolio />;
            case 1:
                return <InsurancePortfolio />;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <NavBar />
            <div className="container flex">
                <SelectedTracerStore>
                    <InsuranceStore>
                        <LeftPanel>
                            <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                        </LeftPanel>
                        <RightPanel>{content()}</RightPanel>
                    </InsuranceStore>
                </SelectedTracerStore>
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
