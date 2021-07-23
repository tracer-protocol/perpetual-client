import React from 'react';
import { NavBarContent } from '@components/Nav/Navbar';
import NavBar from '@components/Nav';
import { Advanced } from '@components/Trade';
import styled from 'styled-components';
import { StyledMenu as AccountDropdown } from '@components/Nav/Navbar/AccountDropdown';
import Footer from '@components/Footer';

const Trade: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <Advanced />
            <Footer />
        </div>
    );
})`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    color: var(--color-text);

    .container {
        max-width: 100% !important;
    }

    ${NavBarContent}, ${Footer} {
        padding: 0 16px;
    }

    ${AccountDropdown} {
        right: -0.5rem !important;
    }

    @media (min-width: 1800px) {
        ${NavBarContent}, ${Footer} {
            padding: 0 5rem;
        }
    }
`;

export default Trade;
