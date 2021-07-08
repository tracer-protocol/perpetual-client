import React, { FC, useState } from 'react';
import SubNav from '@components/Nav/SubNav';
import OpenDeposits from '@components/Portfolio/Insurance/OpenDeposits';
import DepositHistory from '@components/Portfolio/Insurance/DepositHistory';
import WithdrawalHistory from '@components/Portfolio/Insurance/WithdrawalHistory';

const InsurancePortfolio: FC = () => {
    const [tab, setTab] = useState(0);
    const tabs = ['Open Deposits', 'Deposit History', 'Withdrawal History'];
    const content = () => {
        switch (tab) {
            case 0:
                return <OpenDeposits />;
            case 1:
                return <DepositHistory />;
            case 2:
                return <WithdrawalHistory />;
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

export default InsurancePortfolio;
