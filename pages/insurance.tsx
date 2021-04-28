import React from 'react';
import NavBar from '@components/components/Nav/Navbar';
import InsurancePools from '@components/Insurance';
import Loading from '@components/Loading/Loading';
import { InsuranceStore } from '@context/InsuranceContext';
import { SelectedTracerStore } from '@context/TracerContext';

const Insurance: React.FC = () => {
    return (
        <div className="page">
            <NavBar />
            <Loading />
            <SelectedTracerStore>
                <InsuranceStore>
                    <InsurancePools />
                </InsuranceStore>
            </SelectedTracerStore>
        </div>
    );
};

export default Insurance;
