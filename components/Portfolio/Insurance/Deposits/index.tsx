import React, { FC, useEffect, useRef, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import ActiveDeposits from '@components/Portfolio/Insurance/Deposits/ActiveDeposits';
import DepositsHistory from '@components/Portfolio/Insurance/Deposits/DepositsHistory';
import { Counter, PortfolioDropdown } from '@components/Portfolio';
import { InsuranceTransaction } from '@libs/types/InsuranceTypes';
import Insurance from '@libs/Tracer/Insurance';

interface DProps {
    parentHeight: number;
    insuranceContracts: Insurance[];
    depositHistory: InsuranceTransaction[];
}
const Deposits: FC<DProps> = ({ parentHeight, insuranceContracts, depositHistory }: DProps) => {
    const [tab, setTab] = useState(0);
    const tabs = [
        <>
            Active <Counter>{depositHistory.length}</Counter>
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
                return (
                    <ActiveDeposits
                        parentHeight={parentHeight - subNavHeight}
                        insuranceContracts={insuranceContracts}
                    />
                );
            case 1:
                return <DepositsHistory parentHeight={parentHeight - subNavHeight} depositHistory={depositHistory} />;
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
                        setOptions={(num) => setCurrentPortfolio(num as number)}
                        selectedOption={currentPortfolio}
                        keyMap={portfolioKeyMap}
                        defaultValue="All Time"
                    />
                </SubNav>
            </div>
            {content()}
        </>
    );
};

export default Deposits;
