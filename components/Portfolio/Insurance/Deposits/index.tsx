import React, { FC, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import ActiveDeposits from '@components/Portfolio/Insurance/Deposits/ActiveDeposits';
import DepositsHistory from '@components/Portfolio/Insurance/Deposits/DepositsHistory';
import { Counter, PortfolioDropdown } from '@components/Portfolio';

const Deposits: FC = () => {
    const [tab, setTab] = useState(0);
    const tabs = [
        <>
            Active <Counter>0</Counter>
        </>,
        <>History</>,
    ];
    const content = () => {
        switch (tab) {
            case 0:
                return <ActiveDeposits />;
            case 1:
                return <DepositsHistory />;
            default:
                return;
        }
    };
    const [currentPortfolio, setCurrentPortfolio] = useState(1);
    const portfolioKeyMap: Record<number, string> = {
        1: 'All Time',
        2: 'Today',
        3: 'This Week',
        4: 'This Month',
    };
    return (
        <>
            <SubNav tabs={tabs} setTab={setTab} selected={tab}>
                <PortfolioDropdown
                    setOptions={setCurrentPortfolio}
                    option={currentPortfolio}
                    keyMap={portfolioKeyMap}
                />
            </SubNav>
            {content()}
        </>
    );
};

export default Deposits;
