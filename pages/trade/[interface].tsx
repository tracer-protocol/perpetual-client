import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@components/Nav';
import { Basic, Advanced } from '@components/Trade';
import { OrderStore, ErrorInfo, SelectedTracerStore } from 'context';
import { InsuranceStore } from '@context/InsuranceContext';

const Trade: React.FC = () => {
    const router = useRouter();
    const { query } = router;
    const advanced = query.interface === 'advanced';
    return (
        <div className="min-h-screen h-screen flex flex-col">
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
};

export default Trade;
