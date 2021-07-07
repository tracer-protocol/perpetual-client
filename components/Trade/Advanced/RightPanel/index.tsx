import React, { FC, useContext } from 'react';
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

const TradingView: FC<{
    selectedTracer: Tracer | undefined;
}> = ({ selectedTracer }) => {
    const { omeState } = useContext(OMEContext);
    const { mostRecentTrades } = useMostRecentMatched(selectedTracer?.address ?? '');

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
                <OrderBook
                    askOrders={omeState?.orders.askOrders}
                    bidOrders={omeState?.orders.bidOrders}
                    marketUp={omeState?.marketUp ?? false}
                    lastTradePrice={omeState?.lastTradePrice ?? new BigNumber(0)}
                />
                <RecentTrades trades={mostRecentTrades} />
            </SBox>
        </>
    );
};

export default TradingView;
