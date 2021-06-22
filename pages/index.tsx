import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@components/Nav';
import { Advanced } from '@components/Trade';
import { OrderStore, SelectedTracerStore } from 'context';
import { InsuranceStore } from '@context/InsuranceContext';
import styled from 'styled-components';
import { OMEStore } from '@context/OMEContext';

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
                        {/*<OrderStore>{advanced ? <Advanced /> : <Basic />}</OrderStore>*/}
                        <OrderStore>
                            <Advanced />
                        </OrderStore>
                    </InsuranceStore>
                </OMEStore>
            </SelectedTracerStore>
        </div>
    );
})`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    color: var(--color-text);
`;

export default Trade;
