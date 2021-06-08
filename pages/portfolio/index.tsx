import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SideNav from '@components/Nav/SideNav';
import TradingPortfolio from '@components/Portfolio/Trading';
import InsurancePortfolio from '@components/Portfolio/Insurance';

const LeftPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-left: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
`;

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
                <LeftPanel>
                    <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                </LeftPanel>
                <RightPanel>{content()}</RightPanel>
            </div>
        </div>
    );
})`
    min-height: 100vh;
    flex-direction: column;
    background-color: #000240;
    color: #fff;
`;
