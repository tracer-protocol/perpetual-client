import React, { FC } from 'react';
import styled from 'styled-components';

const Footer: FC = styled(({ className }) => {
    return (
        <FooterContent className={`${className} container`}>
            <Section>
                <Logo alt="tracer-logo" src="/img/logos/tracer/tracer_perps.svg" />
                <Copyright>&copy; 2021 Tracer DAO</Copyright>
            </Section>
            <Section>
                <Item>Privacy Policy</Item>
                <Item>Terms of Use</Item>
                <Item>Disclaimer</Item>
                <Item>Docs</Item>
                <Item>FAQs</Item>
                <Item>Tutorials</Item>
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
