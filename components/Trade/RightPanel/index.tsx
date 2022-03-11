import React, { FC, useContext, useState } from 'react';
import OrderBook, { PrecisionDropdown } from '@components/OrderBook';
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
import SlideSelect, { Option, SlideOption } from '@components/General/SlideSelect';
import { FilledOrder, OMEOrder } from '@libs/types/OrderTypes';

const TitledBox = styled(({ className, title, children }) => {
    return (
        <span className={className}>
            <p>{title}</p>
            {children}
        </span>
    );
})`
    border-right: 1px solid var(--color-accent);
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: auto;
    width: 100%;
    color: var(--color-text);
    letter-spacing: var(--letter-spacing-small);
    font-size: var(--font-size-small);
    padding: 0 16px;
    height: var(--height-small-container);

    > p {
        color: var(--color-secondary);
        font-size: var(--font-size-extra-small);
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
                    fundingRate={
                        selectedTracer?.getFundingRate().fundingRate?.toNumber() ??
                        defaults.defaultFundingRate.fundingRate.toNumber()
                    }
                    // nextFunding={new Date()}
                    // tradingVolume={243512}
                    maxLeverage={selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage}
                />
                <Graphs />
                <AccountSummary selectedTracer={selectedTracer} />
            </SBox>
            <SBox className="sidePanel">
                <InsuranceInfo
                    fundingRate={
                        selectedTracer?.getInsuranceFundingRate().fundingRate ?? defaults.defaultFundingRate.fundingRate
                    }
                />
                <TradesAndBook
                    askOrders={omeState?.orders.askOrders}
                    bidOrders={omeState?.orders.bidOrders}
                    marketUp={omeState?.marketUp ?? false}
                    lastTradePrice={omeState?.lastTradePrice ?? new BigNumber(0)}
                    mostRecentTrades={mostRecentTrades}
                />
            </SBox>
        </>
    );
};

export default TradingView;

interface TBProps {
    askOrders: OMEOrder[] | undefined;
    bidOrders: OMEOrder[] | undefined;
    marketUp: boolean;
    lastTradePrice: BigNumber;
    mostRecentTrades: FilledOrder[];
}
const TradesAndBook: React.FC<TBProps> = ({
    askOrders,
    bidOrders,
    marketUp,
    lastTradePrice,
    mostRecentTrades,
}: TBProps) => {
    const [decimals, setDecimals] = useState(1);
    const [selected, setSelected] = useState(SHOW_BOOK);
    return (
        <>
            <StyledSlideSelect onClick={(index, _e) => setSelected(index)} value={selected}>
                <Option>Order Book</Option>
                <Option>Recent Trades</Option>
            </StyledSlideSelect>
            <OrderBook
                askOrders={askOrders}
                decimals={decimals}
                setDecimals={setDecimals}
                bidOrders={bidOrders}
                marketUp={marketUp ?? false}
                lastTradePrice={lastTradePrice ?? new BigNumber(0)}
                displayBook={selected === SHOW_BOOK}
            />
            <RecentTrades trades={mostRecentTrades} displayTrades={selected !== SHOW_BOOK} />
        </>
    );
};

const StyledSlideSelect = styled(SlideSelect)`
    border-radius: 0;
    border-top: 1px solid var(--color-accent);
    border-bottom: 0;
    border-right: 0;
    margin: 0;
    display: none;
    width: 100%;
    white-space: nowrap;
    border-left: 0;
    color: var(--color-secondary);
    min-height: var(--height-extra-small-container);

    > .selected {
        font-weight: bold;
        color: #fff;

        ${Option} ${PrecisionDropdown} {
            display: flex;
        }
    }

    @media (max-height: 1080px) {
        display: flex;
    }

    ${SlideOption} {
        padding: 0 0.8rem;
        @media (max-width: 1600px) {
            text-align: left;
        }
    }

    ${Option} {
        font-size: var(--font-size-small);
        display: flex;
        align-items: center;
        @media (max-width: 1600px) {
            margin: unset;
        }
    }

    ${Option} ${PrecisionDropdown} {
        position: relative;
        top: 0;
        right: 0;
        font-size: var(--font-size-small);
        max-width: 4rem;
        height: 24px;
        margin-left: 8px;
        display: none;
        @media (max-height: 1080px) {
            position: absolute;
            bottom: -80px;
            top: unset;
            left: 70px;
        }
    }
    > .bg-slider {
        background: var(--color-accent);
        border-radius: 0;
    }
`;

const SHOW_BOOK = 0;
