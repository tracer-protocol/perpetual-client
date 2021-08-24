import React, { FC } from 'react';
import { NavBarContent } from '@components/Nav/Navbar';
import NavBar from '@components/Nav';
import styled from 'styled-components';
import { StyledMenu as AccountDropdown } from '@components/Nav/Navbar/AccountDropdown';
import Footer from '@components/Footer';
import Advanced from '@components/Trade';
import { OrderStore, SelectedTracerStore } from 'context';
import { InsuranceStore } from '@context/InsuranceContext';
import { OMEStore } from '@context/OMEContext';
import { useRouter } from 'next/router';

const Trade: FC = styled(({ className }) => {
    const router = useRouter();
    const { query } = router;
    return (
        <div className={className}>
            <NavBar />
            <SelectedTracerStore tracer={query.tracer as string}>
                <OMEStore>
                    <InsuranceStore>
                        <OrderStore>
                            <Advanced />
                        </OrderStore>
                    </InsuranceStore>
                </OMEStore>
            </SelectedTracerStore>
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
