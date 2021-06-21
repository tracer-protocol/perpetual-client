import React, { useContext, useState, useEffect } from 'react';
import { FactoryContext, TracerContext } from 'context';
import { Tracer } from 'libs';
import { Box, Logo } from '@components/General';
import styled from 'styled-components';
import { initialFactoryState } from '@context/FactoryContext';
import { toApproxCurrency } from '@libs/utils';
// import MarketChange from '@components/General/MarketChange';

const SLogo = styled(Logo)`
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0.7rem;
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
                        onClick={() => onMarketSelect(tracer.marketId)}
                    >
                        <MarketContainer className="w-1/4">
                            <SLogo ticker={tracer.baseTicker} />
                            <div className="my-auto">{tracer.marketId}</div>
                        </MarketContainer>
                        <div className="info">
                            {/* <MarketChange
                                className="mr-2"
                                size={'lg'}
                                before={false}
                                amount={240}
                            /> */}
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
    font-size: 16px;
    z-index: ${(props) => (props.display ? '10' : '-1')};
    opacity: ${(props) => (props.display ? '1' : '0')};
    height: ${(props) => (props.display ? `${Object.keys(props.tracers).length * 80}px` : '0')};

    > .market {
        // eventually this will have to change to be dynamic as more markets get added
        // this can be done with jQuery and a useEffect when tracers is updated and setting nth-child attr
        transition-delay: 0.5s;
        transition: 0.3s;
        opacity: ${(props) => (props.display ? '1' : '0')};
    }

    > .market:hover {
        background: #002886;
        cursor: pointer;
    }

    > .market .info {
        margin-left: auto;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
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
                <img className="down-arrow w-4 ml-1" src="/img/general/triangle_down.svg" alt="Down Arrow" />
            </div>
        );
    },
)`
    color: #3da8f5;
    font-size: 1rem;
    border: 1px solid #3da8f5;
    border-radius: 20px;
    height: 28px;
    width: 160px;
    text-align: center;

    &:hover {
        cursor: pointer;
    }

    > .down-arrow {
        margin-top: -5px;
        display: inline-block;
        transition: 0.3s;
        transform: ${(props) => (props.arrowUp ? 'rotate(180deg) translateY(-4px)' : 'translateY(-2px)')};
    }
`;

const MarketContainer = styled.div`
    font-size: 1.25rem;
    letter-spacing: -0.4px;
    display: flex;
    max-height: 30px;
`;

const SBox = styled<any>(Box)`
    background-color: ${(props) => props.color as string}!important;
    position: relative;
    z-index: ${(props) => (props.display ? 4 : 1)};
`;

type MSProps = {
    className?: string;
    account: string;
};

export default styled(({ className }: MSProps) => {
    const { factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const { selectedTracer, setTracerId } = useContext(TracerContext);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        const overlay = document.getElementById('trading-overlay');
        if (overlay) {
            popup ? overlay.classList.add('display') : overlay.classList.remove('display');
        }
    }, [popup]);

    return (
        <div className={`${className}`}>
            <SBox color={popup ? '#011772' : '#000240'} display={popup} onMouseLeave={() => setPopup(false)}>
                <MarketContainer>
                    <SLogo ticker={selectedTracer?.baseTicker ?? 'ETH'} />
                    <div className="my-auto">{selectedTracer?.marketId}</div>
                </MarketContainer>
                <div className="ml-auto" onMouseEnter={() => setPopup(true)}>
                    <MarketSelectDropdownButton arrowUp={popup} />
                </div>
                <MarketSelectDropdown
                    tracers={tracers ?? {}}
                    display={popup}
                    onMarketSelect={(tracerId: string) => {
                        if (setTracerId) {
                            setTracerId(tracerId);
                            setPopup(false);
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
    display: ${(props) => (props.account === '' ? 'none' : 'block')};
` as React.FC<MSProps>;
