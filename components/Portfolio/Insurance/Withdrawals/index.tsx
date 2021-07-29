import React, { FC, useEffect, useRef, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import { Counter, PortfolioDropdown } from '@components/Portfolio';
import ActiveWithdrawals from '@components/Portfolio/Insurance/Withdrawals/ActiveWithdrawals';
import WithdrawalsHistory from '@components/Portfolio/Insurance/Withdrawals/WithdrawalsHistory';

interface WProps {
    parentHeight: number;
}
const Withdrawals: FC<WProps> = ({ parentHeight }: WProps) => {
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
                return <ActiveWithdrawals parentHeight={parentHeight - subNavHeight} />;
            case 1:
                return <WithdrawalsHistory parentHeight={parentHeight - subNavHeight} />;
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

export default Withdrawals;
