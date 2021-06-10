import React, { useContext } from 'react';
import LightWeightChart from '@components/Charts/LightWeightChart';
import Timer from '@components/Timer';
import OrderBook from '@components/OrderBook/OrderBook';
import Tracer, { defaults } from '@libs/Tracer';
import { AccountSummary } from '../AccountDetails';
import { InsuranceInfo } from '../RightPanel/InsuranceInfo';
import { Box } from '@components/General';
import RecentTrades from '../RightPanel/RecentTrades';
import { useCandles, useMostRecentMatched } from '@libs/Graph/hooks/Tracer';
import { CandleData } from 'types/TracerTypes';
import { OMEContext } from '@context/OMEContext';
import styled from 'styled-components';
import FundingRateGraphic from '@components/FundingRateGraphic';
import { formatDate, toApproxCurrency } from '@libs/utils';
import BigNumber from 'bignumber.js';

const TitledBox = styled(({ className, title, children }) => {
    return (
        <span className={className}>
            <p>{title}</p>
            {children}
        </span>
    );
})`
    border-right: 1px solid #002886;
    padding: 0.5rem;
    width: 100%;
    color: #fff;
    letter-spacing: -0.32px;
    font-size: 1rem;

    > p {
        color: #005ea4;
        font-size: 12px;
        letter-spacing: -0.24px;
    }
`;

type MIProps = {
    lastPrice: number;
    fairPrice: BigNumber;
    oraclePrice: number;
    fundingRate: number;
    nextFunding: Date;
    tradingVolume: number;
    maxLeverage: BigNumber;
    className?: string;
};

const MarketInfo: React.FC<MIProps> = styled(
    ({
        lastPrice,
        fairPrice,
        oraclePrice,
        fundingRate,
        nextFunding,
        tradingVolume,
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
                <TitledBox title={'Next Funding'}>{formatDate(nextFunding)}</TitledBox>
                <TitledBox title={'24H Trades'}>{tradingVolume.toLocaleString()}</TitledBox>
                <TitledBox title={'Max Leverage'} className="border-r-0">
                    {maxLeverage.toNumber()}x
                </TitledBox>
            </div>
        );
    },
)`
    border-bottom: 1px solid #002886;
    display: flex;
`;

const GraphWrap = styled.div`
    height: 500px;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 20px;
`;

const Graphs = () => {
    const { candles } = useCandles();
    return (
        <>
            <GraphWrap>
                <LightWeightChart candleData={candles as CandleData} />
            </GraphWrap>
        </>
    );
};

const OrderBookContainer = styled.div`
    border-top: 1px solid #002886;
    padding: 10px;

    h3 {
        letter-spacing: -0.4px;
        color: #ffffff;
        text-transform: capitalize;
        font-size: 20px;
        margin-bottom: 5px;
    }
`;

const TradingView: React.FC<{
    selectedTracer: Tracer | undefined;
}> = ({ selectedTracer }) => {
    const { omeState } = useContext(OMEContext);
    const { mostRecentTrades } = useMostRecentMatched(selectedTracer?.address ?? '');

    return (
        <div>
            <div className="flex">
                <Box className="w-3/4 flex flex-col p-0">
                    <MarketInfo
                        lastPrice={59853}
                        fairPrice={selectedTracer?.getFairPrice() ?? defaults.fairPrice}
                        oraclePrice={selectedTracer?.getOraclePrice() ?? defaults.oraclePrice}
                        fundingRate={selectedTracer?.getFeeRate() ?? defaults.feeRate}
                        nextFunding={new Date()}
                        tradingVolume={243512}
                        maxLeverage={selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage}
                    />
                    <Graphs />
                    <AccountSummary selectedTracer={selectedTracer} />
                </Box>
                <Box className="w-1/4 flex flex-col p-0">
                    <InsuranceInfo />
                    <OrderBookContainer>
                        <h3>Order Book</h3>
                        {omeState?.orders?.askOrders?.length || omeState?.orders?.bidOrders?.length ? (
                            <>
                                <Timer />
                                <OrderBook
                                    askOrders={omeState.orders.askOrders}
                                    bidOrders={omeState.orders.bidOrders}
                                />
                            </>
                        ) : (
                            <p>No open orders</p>
                        )}
                    </OrderBookContainer>
                    <RecentTrades trades={mostRecentTrades} />
                </Box>
            </div>
        </div>
    );
};

export default TradingView;
