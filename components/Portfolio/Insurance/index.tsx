import React, { FC } from 'react';
import Deposits from '@components/Portfolio/Insurance/Deposits';
import { SectionHeader, Title } from '@components/Portfolio';

const InsurancePortfolio: FC = () => {
    return (
        <>
            <SectionHeader border>
                <Title>Deposits</Title>
            </SectionHeader>
            <Deposits />
        </>
    );
};

export default InsurancePortfolio;
