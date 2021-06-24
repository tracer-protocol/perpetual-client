import React from 'react';
import NavBar from '@components/Nav/Navbar';
import { InsuranceStore } from '@context/InsuranceContext';
import { SelectedTracerStore } from '@context/TracerContext';
import Pools from '@components/Insurance/Pools';
import styled from 'styled-components';
import { Button } from '@components/Portfolio';

const InsurancePoolsContent = styled.div`
    width: 100%;
    border-top: 1px solid var(--color-accent);
    border-left: 1px solid var(--color-accent);
`;

const InsurancePoolsHeader = styled.div`
    width: 100%;
    margin: 0 auto;
    color: white;
    padding: 1rem;
    font-size: var(--font-size-small);
    border-left: 1px solid var(--color-accent);
    border-right: 1px solid var(--color-accent);
`;

const InsurancePoolsFooter = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    color: white;
    padding: 2rem 1rem;
    font-size: var(--font-size-small);

    > .learn-more {
        margin-left: 1rem;
    }
`;

const Insurance: React.FC = styled(({ className }) => {
    const ButtonTheme = {
        width: '150px',
        hoverFG: '#fff',
        hoverBG: 'var(--color-primary)',
        hoverCursor: 'pointer',
    };

    return (
        <div className={`${className} page`}>
            <NavBar />
            <div className="container">
                <SelectedTracerStore>
                    <InsuranceStore>
                        <InsurancePoolsHeader>Insurance Pools</InsurancePoolsHeader>
                        <InsurancePoolsContent>
                            <Pools />
                        </InsurancePoolsContent>
                        <InsurancePoolsFooter>
                            New to insurance pools?{' '}
                            <a
                                href="https://docs.tracer.finance/products/perpetual-swaps/insurance"
                                target="_blank"
                                rel="noreferrer"
                                className="learn-more"
                            >
                                <Button theme={ButtonTheme}>Learn More</Button>
                            </a>
                        </InsurancePoolsFooter>
                    </InsuranceStore>
                </SelectedTracerStore>
            </div>
        </div>
    );
})`
    position: relative;
    background: var(--color-background);
`;

export default Insurance;
