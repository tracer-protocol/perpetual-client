import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Deposits from '@components/Portfolio/Insurance/Deposits';
import Withdrawals from '@components/Portfolio/Insurance/Withdrawals';
import { SectionHeader, Title } from '@components/Portfolio';
import { useAllInsuranceTransactions } from '@libs/Graph/hooks/Tracer';
import { InsuranceTransaction } from '@libs/types/InsuranceTypes';
import { InsuranceContext } from '@context/InsuranceContext';

const InsurancePortfolio: FC = () => {
    const section = useRef(null);
    const sectionHeader = useRef(null);
    const [sectionHeight, setSectionHeight] = useState(0);
    const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setSectionHeight(section?.current?.clientHeight);
    }, [section]);
    useEffect(() => {
        // @ts-ignore
        setSectionHeaderHeight(sectionHeader?.current?.clientHeight);
    }, [sectionHeader]);

    const { pools } = useContext(InsuranceContext);

    const { insuranceTransactions } = useAllInsuranceTransactions();
    const [depositHistory, setDepositHistory] = useState<InsuranceTransaction[]>([]);
    const [withdrawalHistory, setWithdrawalHistory] = useState<InsuranceTransaction[]>([]);
    useEffect(() => {
        const depositHistory: InsuranceTransaction[] = [];
        const withdrawalHistory: InsuranceTransaction[] = [];

        Object.values(insuranceTransactions).map((insuranceTransaction) => {
            if (insuranceTransaction.transactionType === 'DEPOSIT') {
                depositHistory.push(insuranceTransaction);
            }
            if (insuranceTransaction.transactionType === 'WITHDRAW') {
                withdrawalHistory.push(insuranceTransaction);
            }
        });

        setDepositHistory(depositHistory);
        setWithdrawalHistory(withdrawalHistory);
    }, [insuranceTransactions]);

    return (
        <>
            <Section ref={section}>
                <SectionHeader border ref={sectionHeader}>
                    <Title>Deposits</Title>
                </SectionHeader>
                <Deposits
                    parentHeight={sectionHeight - sectionHeaderHeight}
                    pools={pools ?? {}}
                    depositHistory={depositHistory}
                />
            </Section>
            <Section ref={section}>
                <SectionHeader border ref={sectionHeader}>
                    <Title>Withdrawals</Title>
                </SectionHeader>
                <Withdrawals parentHeight={sectionHeight - sectionHeaderHeight} withdrawalHistory={withdrawalHistory} />
            </Section>
        </>
    );
};

export default InsurancePortfolio;

const Section = styled.div`
    height: 50%;
`;
