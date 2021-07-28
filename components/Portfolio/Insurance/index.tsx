import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Deposits from '@components/Portfolio/Insurance/Deposits';
import Withdrawals from '@components/Portfolio/Insurance/Withdrawals';
import { SectionHeader, Title } from '@components/Portfolio';

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
    return (
        <>
            <Section ref={section}>
                <SectionHeader border ref={sectionHeader}>
                    <Title>Deposits</Title>
                </SectionHeader>
                <Deposits parentHeight={sectionHeight - sectionHeaderHeight} />
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
