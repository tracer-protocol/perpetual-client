import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@components/Nav/NavBar';
import LivePositions from '@components/Account/LivePositions';
import History from '@components/Account/History';
import { SubNavBar } from '@components/Nav';
import { SelectedTracerStore } from '@context/TracerContext';
import { AccountStore } from '@components/context';

const Account: React.FC = () => {
    // const [tab, setTab] = useState(0);
    const subTabs = ['Live Positions', 'History'];
    const router = useRouter();
    const { query } = router;
    const tab = query.page === 'history' ? 1 : 0;

    const setTab = (tab: number) => {
        switch (tab) {
            case 1:
                router.push('/account/history');
                break;
            case 0:
            default:
                router.push('/account/positions');
        }
    };

    const renderContent = (tab: number) => {
        switch (tab) {
            case 1:
                return <History />;
            default:
                return <LivePositions />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <SubNavBar setTab={setTab} tabs={subTabs} selected={tab} />
            <SelectedTracerStore>
                <AccountStore>{renderContent(tab)}</AccountStore>
            </SelectedTracerStore>
        </div>
    );
};

export default Account;
