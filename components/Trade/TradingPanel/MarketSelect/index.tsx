import React, { useContext, useState, useEffect } from 'react';
import { FactoryContext, TracerContext } from '@context/index';
import Tracer from '@libs/Tracer';
import { Box, Logo } from '@components/General';
import styled from 'styled-components';
import { initialFactoryState } from '@context/FactoryContext';
import { toApproxCurrency } from '@libs/utils';
import Cookies from 'universal-cookie';

const SLogo = styled(Logo)`
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0.7rem;
    @media (max-width: 1279px) {
        margin-right: 0.5rem;
        width: 20px;
    }
`;

type MarketSelectDropdownProps = {
    tracers: Record<string, Tracer>;
    onMarketSelect: (tracerId: string) => any;
    display: boolean;
    className?: string;
};
const MarketSelectDropdown: React.FC<MarketSelectDropdownProps> = styled(
    ({ className, tracers, onMarketSelect }: MarketSelectDropdownProps) => {
        return (
            <div className={className}>
                {Object.values(tracers).map((tracer) => (
                    <Box
                        className="market"
                        key={`tracer-market-${tracer.marketId}`}
                        onClick={() => onMarketSelect(tracer.address)}
                    >
                        <MarketContainer className="w-1/4">
                            <SLogo ticker={tracer.baseTicker} />
                            <div className="my-auto">{tracer.marketId}</div>
                        </MarketContainer>
                        <div className="info">
                            <div>{toApproxCurrency(tracer.getOraclePrice())}</div>
                        </div>
                    </Box>
                ))}
            </div>
        );
    },
)`
    transition: 0.5s;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #011772;
    font-size: var(--font-size-small);
    z-index: ${(props) => (props.display ? '10' : '-1')};
    opacity: ${(props) => (props.display ? '1' : '0')};
    height: ${(props) => (props.display ? `${Object.keys(props.tracers).length * 80}px` : '0')};
    @media (max-width: 1600px) {
        height: ${(props) => (props.display ? `${Object.keys(props.tracers).length * 65}px` : '0')};
    }

    > ${Box} {
        transition-delay: 0.5s;
        transition: 0.3s;
        padding: 10px 12px;
        opacity: ${(props) => (props.display ? '1' : '0')};
    }

    > ${Box}:hover {
        background: var(--color-accent);
        cursor: pointer;
    }

    > ${Box} .info {
        margin: auto 0 auto auto;
        display: flex;
        justify-content: space-between;
        font-size: var(--font-size-small);
        line-height: 30px;
    }
`;

type MarketSelectDropdownButtonProps = {
    className?: string;
    arrowUp?: boolean;
};
const MarketSelectDropdownButton: React.FC<MarketSelectDropdownButtonProps> = styled(
    ({ className, arrowUp }: MarketSelectDropdownButtonProps) => {
        return (
            <div className={className}>
                <span>{arrowUp ? 'Hide Markets' : 'View Markets'}</span>
                <img className="down-arrow" src="/img/general/triangle_down.svg" alt="Down Arrow" />
            </div>
        );
    },
)<MarketSelectDropdownButtonProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-primary);
    font-size: var(--font-size-small);
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    width: 150px;
    padding: 0 10px 0 15px;
    height: var(--height-small-button);
    margin: auto 0;

    &:hover {
        cursor: pointer;
    }

    > .down-arrow {
        width: 15px;
        height: 15px;
        transition: 0.3s;
        transform: ${(props) => (props.arrowUp ? 'rotate(180deg) translateY(-4px)' : 'translateY(-2px)')};
    }

    @media (max-width: 1279px) {
        width: 120px;
        padding-right: 5px;
    }

    @media (max-width: 1600px) {
        height: 22px;
    }
`;

const MarketContainer = styled.div`
    font-size: var(--font-size-medium);
    letter-spacing: var(--letter-spacing-extra-small);
    display: flex;
    height: var(--height-small-container);
`;

const SBox = styled(Box)<{ $display: boolean; color: string }>`
    background-color: ${(props) => props.color as string}!important;
    position: relative;
    z-index: ${(props) => (props.$display ? 4 : 1)};
    height: var(--height-small-container);
    border-bottom: 1px solid var(--color-accent);
    padding: 0 16px;
    @media (min-width: 1800px) {
        padding: 0 12px;
    }
`;

type MSProps = {
    className?: string;
    account: string;
};
export default styled(({ className }: MSProps) => {
    const { factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const { selectedTracer, setTracerId } = useContext(TracerContext);
    const [popup, setPopup] = useState(false);
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get('setTracerID') === 'true') {
            if (setTracerId) {
                setTracerId(cookies.get('tracerID'));
            }
        }
    }, [selectedTracer]);

    useEffect(() => {
        const overlay = document.getElementById('trading-overlay');
        if (overlay) {
            popup ? overlay.classList.add('display') : overlay.classList.remove('display');
        }
    }, [popup]);

    return (
        <div className={`${className}`}>
            <SBox color={popup ? '#011772' : '#000240'} $display={popup} onMouseLeave={() => setPopup(false)}>
                <MarketContainer>
                    <SLogo ticker={selectedTracer?.baseTicker} />
                    <div className="my-auto">{selectedTracer?.marketId}</div>
                </MarketContainer>
                <div className="ml-auto flex" onMouseEnter={() => setPopup(true)}>
                    <MarketSelectDropdownButton arrowUp={popup} />
                </div>
                <MarketSelectDropdown
                    tracers={tracers ?? {}}
                    display={popup}
                    onMarketSelect={(tracerId: string) => {
                        if (setTracerId) {
                            setTracerId(tracerId);
                            setPopup(false);
                            cookies.set('setTracerID', 'true', { path: '/' });
                            cookies.set('tracerID', tracerId, { path: '/' });
                        } else {
                            console.error('Failed to set tracer, setTracerId undefined');
                        }
                    }}
                />
            </SBox>
        </div>
    );
})`
    width: 100%;
` as React.FC<MSProps>;
