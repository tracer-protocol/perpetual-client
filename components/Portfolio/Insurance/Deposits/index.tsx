import React, { FC, useEffect, useRef, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import ActiveDeposits from '@components/Portfolio/Insurance/Deposits/ActiveDeposits';
import DepositsHistory from '@components/Portfolio/Insurance/Deposits/DepositsHistory';
import { Counter, PortfolioDropdown } from '@components/Portfolio';

interface DProps {
    parentHeight: number;
}
const Deposits: FC<DProps> = ({ parentHeight }: DProps) => {
    const [tab, setTab] = useState(0);
    const tabs = [
        <>
            Active <Counter>0</Counter>
        </>,
        <>History</>,
    ];

    const subNav = useRef(null);
    const [subNavHeight, setSubNavHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setSubNavHeight(subNav?.current?.clientHeight);
    }, [subNav]);

    const content = () => {
        switch (tab) {
            case 0:
                return <ActiveDeposits parentHeight={parentHeight - subNavHeight} />;
            case 1:
                return <DepositsHistory parentHeight={parentHeight - subNavHeight} />;
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
            <div ref={subNav}>
                <SubNav tabs={tabs} setTab={setTab} selected={tab}>
                    <PortfolioDropdown
                        setOptions={setCurrentPortfolio}
                        option={currentPortfolio}
                        keyMap={portfolioKeyMap}
                    />
                </SubNav>
            </div>
            {content()}
        </>
    );
};

export default Deposits;
