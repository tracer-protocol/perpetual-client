import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@components/Nav';
import { Basic, Advanced } from '@components/Trade';
import { OrderStore, ErrorInfo, SelectedTracerStore } from 'context';
import { InsuranceStore } from '@context/InsuranceContext';
import styled from 'styled-components';

const Trade: React.FC = styled(({ className }) => {
    const router = useRouter();
    const { query } = router;
    const advanced = query.interface === 'advanced';
    return (
        <div className={className}>
            <NavBar />
            <SelectedTracerStore tracer={query.tracer as string}>
                <InsuranceStore>
                    <ErrorInfo>
                        <OrderStore>{advanced ? <Advanced /> : <Basic />}</OrderStore>
                    </ErrorInfo>
                </InsuranceStore>
            </SelectedTracerStore>
        </div>
    );
})`
    min-height: 100vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #03065e;
    color: #fff;
`

export default Trade;
