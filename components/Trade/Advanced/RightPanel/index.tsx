import React, { useContext } from 'react';
import OrderBook from '@components/OrderBook/OrderBook';
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

import AccountSummary from './AccountDetails';
import InsuranceInfo from './InsuranceInfo';
import Graphs from './Graphs';

const TitledBox = styled(({ className, title, children }) => {
    return (
        <span className={className}>
            <p>{title}</p>
            {children}
        </span>
    );
})`
    border-right: 1px solid var(--color-accent);
    padding:  0 0.5rem;
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 100%;
    color: var(--color-text);
    letter-spacing: -0.32px;
    font-size: var(--font-size-small);

    > p {
        color: #005ea4;
        font-size: 12px;
        letter-spacing: -0.24px;
        margin-bottom: 0.2rem;
    }
`;

type MIProps = {
    lastPrice: number;
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
                <TitledBox title={'Mark Price'}>{toApproxCurrency(fairPrice)}</TitledBox>
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
    padding: 10px;
    padding-right: 0;
    height: 35vh;
    display: flex;
    flex-direction: column;
    h3 {
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
        font-size: var(--font-size-medium);
        margin-bottom: 5px;
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

const TradingView: React.FC<{
    selectedTracer: Tracer | undefined;
}> = ({ selectedTracer }) => {
    const { omeState } = useContext(OMEContext);
    const { mostRecentTrades } = useMostRecentMatched(selectedTracer?.address ?? '');
    return (
        <>
            <SBox className="middlePanel">
                <MarketInfo
                    lastPrice={omeState?.maxAndMins?.maxAsk ?? 0}
                    fairPrice={selectedTracer?.getFairPrice() ?? defaults.fairPrice}
                    oraclePrice={selectedTracer?.getOraclePrice() ?? defaults.oraclePrice}
                    fundingRate={selectedTracer?.getFundingRate()?.toNumber() ?? defaults.fundingRate.toNumber()}
                    // nextFunding={new Date()}
                    // tradingVolume={243512}
                    maxLeverage={selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage}
                />
                <Graphs selectedTracerAddress={selectedTracer?.address ?? ''} />
                <AccountSummary selectedTracer={selectedTracer} />
            </SBox>
            <SBox className="sidePanel">
                <InsuranceInfo />
                <OrderBookContainer>
                    <h3>Order Book</h3>
                    {omeState?.orders?.askOrders?.length || omeState?.orders?.bidOrders?.length ? (
                        <>
                            <OrderBook askOrders={omeState.orders.askOrders} bidOrders={omeState.orders.bidOrders} />
                        </>
                    ) : (
                        <p>No open orders</p>
                    )}
                </OrderBookContainer>
                <RecentTrades trades={mostRecentTrades} />
            </SBox>
        </>
    );
};

export default TradingView;
