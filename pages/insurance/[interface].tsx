import React from 'react';
import NavBar from '@components/Nav/Navbar';
import Loading from '@components/Loading/Loading';
import { InsuranceStore } from '@context/InsuranceContext';
import { SelectedTracerStore } from '@context/TracerContext';
import Pools from '@components/Insurance/Pools';
import styled from 'styled-components';
import { Button } from '@components/Portfolio';

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
    padding: 1rem;
    font-size: 1rem;
    border-left: 1px solid #002886;
    border-right: 1px solid #002886;
`;

const InsurancePoolsFooter = styled.div`
    width: 90%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    color: white;
    padding: 2rem 1rem;
    font-size: 1rem;

    > .learn-more {
        margin-left: 1rem;
    }
`;

const Insurance: React.FC = styled(({ className }) => {
    const ButtonTheme = {
        width: '150px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    return (
        <div className={`${className} page`}>
            <NavBar />
            {/*<Loading />*/}
            <SelectedTracerStore>
                <InsuranceStore>
                    <InsurancePoolsHeader>Insurance Pools</InsurancePoolsHeader>
                    <InsurancePoolsContent>
                        <Pools />
                    </InsurancePoolsContent>
                    <InsurancePoolsFooter>
                        New to insurance pools?{' '}
                        <Button className="learn-more" theme={ButtonTheme}>
                            Learn More
                        </Button>
                    </InsurancePoolsFooter>
                </InsuranceStore>
            </SelectedTracerStore>
        </div>
    );
})`
    position: relative;
    background: #03065e;
`;

export default Insurance;
