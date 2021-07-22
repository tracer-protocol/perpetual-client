import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@components/Nav';
import { Advanced } from '@components/Trade';
import { OrderStore, SelectedTracerStore } from 'context';
import { InsuranceStore } from '@context/InsuranceContext';
import styled from 'styled-components';
import { OMEStore } from '@context/OMEContext';
import { StyledMenu as AccountDropdown } from '@components/Nav/Navbar/AccountDropdown';
import Footer from '@components/Footer';

const Trade: React.FC = styled(({ className }) => {
    const router = useRouter();
    const { query } = router;
    // const advanced = query.interface === 'advanced';
    return (
        <div className={className}>
            <NavBar />
            <SelectedTracerStore tracer={query.tracer as string}>
                <OMEStore>
                    <InsuranceStore>
                        {/*TODO: Enable basic trading*/}
                        {/* <OrderStore>{advanced ? <Advanced /> : <Basic />}</OrderStore> */}
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

    ${NavBar}, ${Footer} {
        padding: 0 12px;
    }

    ${AccountDropdown} {
        right: -0.5rem !important;
    }

    @media (min-width: 1800px) {
        ${NavBar}, ${Footer} {
            padding: 0 5rem;
        }
    }
`;

export default Trade;
