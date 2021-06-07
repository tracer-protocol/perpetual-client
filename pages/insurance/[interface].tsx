import React from 'react';
import NavBar from '@components/Nav/Navbar';
import Loading from '@components/Loading/Loading';
import { InsuranceStore } from '@context/InsuranceContext';
import { SelectedTracerStore } from '@context/TracerContext';
import Pools from '@components/Insurance/Pools';
import styled from 'styled-components';

const InsurancePoolsContent = styled.div`
    width: 90%;
    margin: 0 auto;
    border-top: 1px solid #002886;
    border-left: 1px solid #002886;
`;

const InsurancePoolsHeader = styled.div`
    width: 90%;
    margin: 0 auto;
    color: white;
    padding: 0 1rem 1rem;
    font-size: 1rem;
`;

const Insurance: React.FC = styled(({ className }) => {
    return (
        <div className={`${className} page`}>
            <NavBar />
            <Loading />
            <SelectedTracerStore>
                <InsuranceStore>
                    <InsurancePoolsHeader>Insurance Pools</InsurancePoolsHeader>
                    <InsurancePoolsContent>
                        <Pools />
                    </InsurancePoolsContent>
                </InsuranceStore>
            </SelectedTracerStore>
        </div>
    );
})`
    position: relative;
    background: #03065e;
`;

export default Insurance;
