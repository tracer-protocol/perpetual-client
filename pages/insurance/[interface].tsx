import React from 'react';
import NavBar from '@components/Nav/Navbar';
import Loading from '@components/Loading/Loading';
import { InsuranceStore } from '@context/InsuranceContext';
import { SelectedTracerStore } from '@context/TracerContext';
import { useRouter } from 'next/router';
import Pools from '@components/Insurance/Pools';
import Portfolio from '@components/Insurance/Portfolio';
import styled from 'styled-components';
import { SubNav } from '@components/Nav/SubNavBar';

const Content = styled.div`
    background: #03065e;
    width: 80%;
    margin: 0 auto;
`;

const Insurance: React.FC = styled(({ className }) => {
    const tabs = ['Insurance Pools', 'Insurance Portfolio'];
    const router = useRouter();
    const { query } = router;
    const portfolio = query.interface === 'portfolio';
    return (
        <div className={`${className} page`}>
            <NavBar />
            <Loading />
            <SelectedTracerStore>
                <InsuranceStore>
                    <Content>
                        <SubNav
                            tabs={tabs}
                            selected={portfolio ? 1 : 0}
                            setTab={(tab: number) => {
                                router.push(tab === 0 ? '/insurance/pools' : '/insurance/portfolio');
                            }}
                        />
                        {portfolio ? <Portfolio /> : <Pools />}
                    </Content>
                </InsuranceStore>
            </SelectedTracerStore>
        </div>
    );
})`
    position: relative;
    background: #03065e;
`;

export default Insurance;
