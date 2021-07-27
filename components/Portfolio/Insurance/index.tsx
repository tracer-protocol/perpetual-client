import React, { FC } from 'react';
import styled from 'styled-components';
import Deposits from '@components/Portfolio/Insurance/Deposits';
import Withdrawals from '@components/Portfolio/Insurance/Withdrawals';
import { SectionHeader, Title } from '@components/Portfolio';

const InsurancePortfolio: FC = () => {
    return (
        <>
            <Section>
                <SectionHeader border>
                    <Title>Deposits</Title>
                </SectionHeader>
                <Deposits />
            </Section>
            <Section>
                <SectionHeader border>
                    <Title>Withdrawals</Title>
                </SectionHeader>
                <Withdrawals />
            </Section>
        </>
    );
};

export default InsurancePortfolio;

const Section = styled.div`
    height: 50%;
`;
