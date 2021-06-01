import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SideNav from '@components/Nav/SideNav';
import { LeftPanel, RightPanel } from '@components/Portfolio';
import TradingPortfolio from '@components/Portfolio/Trading';
import InsurancePortfolio from '@components/Portfolio/Insurance';

const Portfolio: React.FC = styled(({ className }) => {
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
            <div className="flex h-full">
                <LeftPanel>
                    <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                </LeftPanel>
                <RightPanel>{content()}</RightPanel>
            </div>
        </div>
    );
})`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #03065e;
    color: #fff;
`;

export default Portfolio;
