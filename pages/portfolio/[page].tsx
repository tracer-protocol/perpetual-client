import React from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';

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

const Portfolio: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <div className="flex h-full">
                <LeftPanel>Left Panel</LeftPanel>
                <RightPanel>Right Panel</RightPanel>
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
