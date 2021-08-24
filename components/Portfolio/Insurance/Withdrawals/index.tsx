import React, { FC, useEffect, useRef, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import { Counter, PortfolioDropdown } from '@components/Portfolio';
import ActiveWithdrawals from '@components/Portfolio/Insurance/Withdrawals/ActiveWithdrawals';
import WithdrawalsHistory from '@components/Portfolio/Insurance/Withdrawals/WithdrawalsHistory';
import { InsurancePoolInfo as InsurancePoolInfoType, InsuranceTransaction } from '@libs/types/InsuranceTypes';

interface WProps {
    parentHeight: number;
    pools: Record<string, InsurancePoolInfoType>;
    withdrawalHistory: InsuranceTransaction[];
}
const Withdrawals: FC<WProps> = ({ parentHeight, pools, withdrawalHistory }: WProps) => {
    const [tab, setTab] = useState(0);
    const tabs = [
        <>
            Active <Counter>{Object.keys(pools).length}</Counter>
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
                return <ActiveWithdrawals parentHeight={parentHeight - subNavHeight} pools={pools} />;
            case 1:
                return (
                    <WithdrawalsHistory
                        parentHeight={parentHeight - subNavHeight}
                        withdrawalHistory={withdrawalHistory}
                    />
                );
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
                    />
                </SubNav>
            </div>
            {content()}
        </>
    );
};

export default Withdrawals;
