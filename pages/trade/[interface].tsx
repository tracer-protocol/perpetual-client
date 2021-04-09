import React from 'react';
import { useRouter } from 'next/router';
import NavBar, { SubNavBar } from '@components/Nav';
import { Basic, Advanced } from '@components/Trade';
import { OrderStore, ErrorInfo, SelectedTracerStore } from 'context';

const Trade: React.FC = () => {
    const subTabs = ['Basic', 'Advanced'];
    const router = useRouter();
    const { query } = router;
    const advanced = query.interface === 'advanced';

    const setTab = (tab: number) => {
        switch (tab) {
            case 1:
                router.push('/trade/advanced');
                break;
            case 0:
            default:
                router.push('/trade/basic');
        }
    };
    return (
        <div className="min-h-screen h-screen flex flex-col">
            <NavBar />
            <SubNavBar setTab={setTab} tabs={subTabs} selected={advanced ? 1 : 0} />
            <SelectedTracerStore tracer={query.tracer as string}>
                <ErrorInfo>
                    <OrderStore>{advanced ? <Advanced /> : <Basic />}</OrderStore>
                </ErrorInfo>
            </SelectedTracerStore>
        </div>
    );
};

export default Trade;
