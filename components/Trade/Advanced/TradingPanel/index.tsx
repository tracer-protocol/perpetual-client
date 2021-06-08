import React, { useContext, useState, useEffect } from 'react';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import { FactoryContext, OrderContext, TracerContext } from 'context';
import InputSelects from './Inputs';
import { Tracer } from 'libs';
import { Box, Logo } from '@components/General';
import styled from 'styled-components';
import { defaults } from '@libs/Tracer';
import PostTradeDetails from './PostTradeDetails';
import BigNumber from 'bignumber.js';
import { initialFactoryState } from '@context/FactoryContext';
import { toApproxCurrency } from '@libs/utils';
import MarketChange from '@components/General/MarketChange';

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
                            <MarketChange
                                className="mr-2"
                                size={'lg'}
                                before={false}
                                amount={tracer.get24HourChange()}
                            />
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
    height: 0;
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
        display: inline-block;
        transition: 0.3s;
        transform: ${(props) => (props.arrowUp ? 'rotate(180deg) translateY(-3px)' : 'translateY(-2px)')};
    }
`;

const MarketContainer = styled.div`
    font-size: 20px;
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
export const MarketSelect: React.FC<MSProps> = styled(({ className }: MSProps) => {
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
        <div className={className}>
            <SBox color={popup ? '#011772' : '#03065e'} display={popup} onMouseLeave={() => setPopup(false)}>
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
`;

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export const TradingInput: React.FC<TIProps> = styled(({ selectedTracer, className }: TIProps) => {
    const { order } = useContext(OrderContext);
    return (
        <Box className={`${className}`}>
            <div className="body text-xs">
                {/* Position select */}
                <div className="py-2">
                    <OrderTypeSelect selected={order?.orderType ?? 0} />
                </div>

                {/* Position select */}
                <div className="py-2">
                    <PositionSelect selected={order?.position ?? 0} />
                </div>

                {/* Quantity and Price Inputs */}
                <InputSelects amount={order?.amountToPay} price={order?.price} selectedTracer={selectedTracer} />

                {/* Dont display these if it is a limit order*/}
                {order?.orderType !== 1 ? (
                    <>
                        {/* Leverage select */}
                        <Leverage leverage={order?.leverage ?? 1} />
                    </>
                ) : (
                    <></>
                )}

                <PostTradeDetails
                    fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                    balances={selectedTracer?.getBalance() ?? defaults.balances}
                    exposure={order?.amountToBuy ? new BigNumber(order.amountToBuy) : defaults.amountToBuy}
                    position={order?.position ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                />

                {/* Place Order */}
                <div className="py-1">
                    <AdvancedOrderButton />
                </div>
            </div>
        </Box>
    );
})`
    transition: 0.8s;
    overflow: scroll;
    opacity: ${(props) => (props.account === '' ? 0 : 1)};
`;

type SProps = {
    selected: number;
};

const SSlideSelect = styled(SlideSelect)`
    height: 40px;
`;

const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                // when we go back to market order we need to ensure the price is locked
                if (orderDispatch) {
                    orderDispatch({ type: 'setPosition', value: index });
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>SHORT</Option>
            <Option>LONG</Option>
        </SSlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                if (orderDispatch) {
                    orderDispatch({ type: 'setOrderType', value: index });
                    if (index === 0) {
                        orderDispatch({ type: 'setLock', value: true });
                    }
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>MARKET</Option>
            <Option>LIMIT</Option>
        </SSlideSelect>
    );
};

type LProps = {
    leverage: number;
    className?: string;
};

const Leverage: React.FC<LProps> = styled(({ leverage, className }: LProps) => {
    return (
        <div className={`${className} m-3`}>
            <a className="label">Leverage</a>
            <div className="w-3/4 p-2">
                <DefaultSlider leverage={leverage} />
            </div>
        </div>
    );
})`
    display: flex;

    > .label {
        margin: auto auto 35px 0;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
    }
`;

export { AccountPanel } from './Account';
