import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@components/Nav/Navbar';
import { SubNavBar } from '@components/Nav';
import { SelectedTracerStore } from '@context/TracerContext';
import { InsuranceStore } from '@context/InsuranceContext';
import { AccountStore } from '@context/AccountContext';

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

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <SubNavBar setTab={setTab} tabs={subTabs} selected={tab} />
            <SelectedTracerStore>
                <InsuranceStore>
                    <AccountStore></AccountStore>
                </InsuranceStore>
            </SelectedTracerStore>
        </div>
    );
};

export default Account;
