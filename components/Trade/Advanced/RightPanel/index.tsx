import React, { FC, useContext, useState } from 'react';
import OrderBook from '@components/OrderBook';
import Tracer, { defaults } from '@libs/Tracer';
import { Box } from '@components/General';
import RecentTrades from './RecentTrades';
import { useMostRecentMatched } from '@libs/Graph/hooks/Tracer';
import { OMEContext } from '@context/OMEContext';
import styled from 'styled-components';
import FundingRateGraphic from '@components/FundingRateGraphic';
import {
    // formatDate,
    toApproxCurrency,
} from '@libs/utils';
import BigNumber from 'bignumber.js';
import AccountSummary from './AccountSummary';
import InsuranceInfo from './InsuranceInfo';
import Graphs from './Graph';
import Icon from '@ant-design/icons';
// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';

const TitledBox = styled(({ className, title, children }) => {
    return (
        <span className={className}>
            <p>{title}</p>
            {children}
        </span>
    );
})`
    border-right: 1px solid var(--color-accent);
    padding: 0 0.5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: auto;
    width: 100%;
    height: 100%;
    color: var(--color-text);
    letter-spacing: -0.32px;
    font-size: var(--font-size-small);

    > p {
        color: var(--color-secondary);
        font-size: var(--font-size-extra-small);
        letter-spacing: -0.24px;
        margin-bottom: 0.2rem;
    }
`;

type MIProps = {
    lastPrice: BigNumber;
    fairPrice: BigNumber;
    oraclePrice: number;
    fundingRate: number;
    // nextFunding: Date;
    // tradingVolume: number;
    maxLeverage: BigNumber;
    className?: string;
};

const MarketInfo: React.FC<MIProps> = styled(
    ({
        lastPrice,
        fairPrice,
        oraclePrice,
        fundingRate,
        // nextFunding,
        // tradingVolume,
        maxLeverage,
        className,
    }: MIProps) => {
        return (
            <div className={className}>
                <TitledBox title={'Last Price'}>{toApproxCurrency(lastPrice)}</TitledBox>
                <TitledBox title={'Fair Price'}>{toApproxCurrency(fairPrice)}</TitledBox>
                <TitledBox title={'Oracle Price'}>{toApproxCurrency(oraclePrice)}</TitledBox>
                <TitledBox title={'Funding Rate'}>
                    <FundingRateGraphic rate={fundingRate} />
                </TitledBox>
                {/* <TitledBox title={'Next Funding'}>{formatDate(nextFunding)}</TitledBox>
                <TitledBox title={'24H Trades'}>{tradingVolume.toLocaleString()}</TitledBox> */}
                <TitledBox title={'Max Leverage'} className="border-r-0">
                    {maxLeverage.toNumber()}x
                </TitledBox>
            </div>
        );
    },
)`
    border-bottom: 1px solid var(--color-accent);
    height: var(--height-small-container);
    display: flex;
`;

const OrderBookContainer = styled.div`
    border-top: 1px solid var(--color-accent);
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0.6rem 0;

    h3 {
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
        font-size: var(--font-size-medium);
        margin: 0 0.8rem 0.5rem;
    }
`;

const SBox = styled(Box)`
    flex-direction: column;
    padding: 0;

    &.sidePanel {
        border-right: 1px solid #0c3586;
        border-left: 1px solid #0c3586;
        width: 32%;
    }

    &.middlePanel {
        width: 68%;
    }
`;

type OBTProps = {
    className?: string;
    showOrderBook: boolean;
    onClick: () => void;
};
const StyledTriangleDown = styled.img`
    height: 0.8rem;
    transition: all 400ms ease-in-out;
    display: inline;
    margin-top: -0.2rem;
    margin-left: 0.2rem;

    &.rotate {
        transform: rotate(180deg);
        margin-top: -4px;
    }
`;
const OrderBookToggle: FC<OBTProps> = styled(({ className, showOrderBook, onClick }: OBTProps) => {
    return (
        <div className={className} onClick={onClick}>
            <StyledTriangleDown
                className={showOrderBook ? 'rotate' : ''}
                src="/img/general/triangle_down_cropped.svg"
            />
        </div>
    );
})`
    position: absolute;
    right: 1rem;
    top: 0.7rem;

    &:hover {
        cursor: pointer;
    }
`;

const TradingView: React.FC<{
    selectedTracer: Tracer | undefined;
}> = ({ selectedTracer }) => {
    const { omeState } = useContext(OMEContext);
    const { mostRecentTrades } = useMostRecentMatched(selectedTracer?.address ?? '');
    const [showOrderBook, setShowOrderBook] = useState(true);

    return (
        <>
            <SBox className="middlePanel">
                <MarketInfo
                    lastPrice={omeState?.lastTradePrice ?? new BigNumber(0)}
                    fairPrice={selectedTracer?.getFairPrice() ?? defaults.fairPrice}
                    oraclePrice={selectedTracer?.getOraclePrice() ?? defaults.oraclePrice}
                    fundingRate={selectedTracer?.getFundingRate()?.toNumber() ?? defaults.defaultFundingRate.toNumber()}
                    // nextFunding={new Date()}
                    // tradingVolume={243512}
                    maxLeverage={selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage}
                />
                <Graphs selectedTracerAddress={selectedTracer?.address ?? ''} />
                <AccountSummary selectedTracer={selectedTracer} />
            </SBox>
            <SBox className="sidePanel">
                <InsuranceInfo fundingRate={selectedTracer?.getInsuranceFundingRate() ?? defaults.defaultFundingRate} />
                <OrderBookContainer>
                    <h3>Order Book</h3>
                    <OrderBookToggle showOrderBook={showOrderBook} onClick={() => setShowOrderBook(!showOrderBook)} />
                    {showOrderBook ? (
                        omeState?.orders?.askOrders?.length || omeState?.orders?.bidOrders?.length ? (
                            <OrderBook
                                askOrders={omeState.orders.askOrders}
                                bidOrders={omeState.orders.bidOrders}
                                marketUp={omeState?.marketUp ?? false}
                                lastTradePrice={omeState?.lastTradePrice ?? new BigNumber(0)}
                            />
                        ) : (
                            <Icon component={TracerLoading} className="mb-3 tracer-loading" />
                        )
                    ) : null}
                </OrderBookContainer>
                <RecentTrades trades={mostRecentTrades} />
            </SBox>
        </>
    );
};

export default TradingView;
