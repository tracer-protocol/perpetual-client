import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SubNav from "@components/Nav/SubNav";

const LeftPanel = styled.div`
    width: 25%;
    margin-left: 5vw;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-left: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    margin-right: 5vw;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
`;

const RightPanelContent = () => {
    const [tab, setTab] = useState(0);
    const tabs = ['Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <>
                        Positions Tab
                    </>
                );
            case 1:
                return (
                    <>
                        Margin Accounts Tab
                    </>
                );
            case 2:
                return (
                    <>
                        Trade History Tab
                    </>
                );
            case 3:
                return (
                    <>
                        Transfers Tab
                    </>
                );
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

const Portfolio: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <div className="flex h-full">
                <LeftPanel>Left Panel</LeftPanel>
                <RightPanel>
                    <RightPanelContent />
                </RightPanel>
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
