import React, { FC } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const Footer: FC = styled(({ className }) => {
    return (
        <FooterContent className={`${className} container`}>
            <Section>
                <Logo alt="tracer-logo" src="/img/logos/tracer/tracer_perps.svg" />
                <Copyright>&copy; 2021 Tracer DAO</Copyright>
            </Section>
            <Section>
                <Item>
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                </Item>
                <Item>
                    <Link href='/terms-of-use'>Terms of Use</Link>
                </Item>
                <Item>
                    <Link href='/disclaimer'>Disclaimer</Link>
                </Item>
                <Item>
                    <Link href='https://docs.tracer.finance/'>Docs</Link>
                </Item>
                <Item>
                    <Link href='https://docs.tracer.finance/perpetual-swaps-faq/'>FAQs</Link>
                </Item>
                <Item>
                    <Link href='https://docs.tracer.finance/trader-tutorials'>Tutorials</Link>
                </Item>
            </Section>
        </FooterContent>
    );
})`
    display: flex;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const FooterContent = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Section = styled.div`
    display: flex;
`;

const Item = styled.div`
    margin-left: 2rem;
    color: var(--color-secondary);
`;

const Copyright = styled.div`
    white-space: nowrap;
    color: var(--color-primary);
`;

const Logo = styled.img`
    height: 1.2rem;
    margin-right: 4rem;
`;

export default Footer;
