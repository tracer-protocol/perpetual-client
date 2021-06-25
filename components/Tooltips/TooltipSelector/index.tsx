import React from 'react';
import {
    StyledTooltip,
    AmountTip,
    PriceTip,
    LeverageTip,
    TotalMarginTip,
    BuyingPowerTip,
    AvailableMarginTip,
    InsurancePoolHealthTip,
    PoolHoldingsTip,
    PoolTargetTip,
    InsuranceFundingRateTip,
    RealisedPnLTip,
    UnrealisedPnLTip,
    ExposureTip,
    LiquidationPriceTip,
    BestTip,
    CurrentAPYTip,
    PoolOwnershipTip,
    BufferTip,
    PublicTip,
    EtherscanLinkTip,
    AdjustPositionTip,
    NewOrderTip
} from '../';
import { BigNumber } from 'bignumber.js';

export type TooltipSelectorProps = {
    key:
        | 'amount'
        | 'price'
        | 'leverage'
        | 'total-margin'
        | 'buying-power'
        | 'available-margin'
        | 'insurance-pool-health'
        | 'pool-holdings'
        | 'pool-target'
        | 'insurance-funding-rate'
        | 'realised-pnl'
        | 'unrealised-pnl'
        | 'exposure'
        | 'liquidation-price'
        | 'best'
        | 'current-apy'
        | 'pool-ownership'
        | 'buffer'
        | 'public'
        | 'adjust-position'
        | 'new-order'
        | 'etherscan-link';
    props?: {
        baseTicker?: string;
        availableMargin?: number;
        maxLeverage?: number;
        quote?: BigNumber;
        position?: number;
    };
};

const TooltipSelector: React.FC<{ tooltip: TooltipSelectorProps }> = ({ tooltip, children }) => {
    switch (tooltip.key) {
        // Market select section
        case 'amount':
            return (
                <AmountTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </AmountTip>
            );
        case 'price':
            return (
                <PriceTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </PriceTip>
            );
        case 'leverage':
            return <LeverageTip className="label">{children}</LeverageTip>;

        // Margin account section
        case 'total-margin':
            return (
                <TotalMarginTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </TotalMarginTip>
            );
        case 'buying-power':
            return (
                <BuyingPowerTip
                    baseTicker={tooltip?.props?.baseTicker ?? ''}
                    availableMargin={tooltip?.props?.availableMargin ?? NaN}
                    maxLeverage={tooltip?.props?.maxLeverage ?? NaN}
                >
                    {children}
                </BuyingPowerTip>
            );
        case 'available-margin':
            return <AvailableMarginTip>{children}</AvailableMarginTip>;

        // Insurance pool health section
        case 'insurance-pool-health':
            return <InsurancePoolHealthTip className="label">{children}</InsurancePoolHealthTip>;
        case 'pool-holdings':
            return (
                <PoolHoldingsTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </PoolHoldingsTip>
            );
        case 'pool-target':
            return (
                <PoolTargetTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </PoolTargetTip>
            );
        case 'insurance-funding-rate':
            return (
                <InsuranceFundingRateTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </InsuranceFundingRateTip>
            );

        // Account details section
        case 'realised-pnl':
            return (
                <RealisedPnLTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </RealisedPnLTip>
            );
        case 'unrealised-pnl':
            return (
                <UnrealisedPnLTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </UnrealisedPnLTip>
            );
        case 'exposure':
            return (
                <ExposureTip baseTicker={tooltip?.props?.baseTicker ?? ''} className="label">
                    {children}
                </ExposureTip>
            );
        case 'liquidation-price':
            return (
                <LiquidationPriceTip
                    quote={tooltip?.props?.quote ?? new BigNumber(NaN)}
                    position={tooltip?.props?.position ?? NaN}
                    className="label"
                >
                    {children}
                </LiquidationPriceTip>
            );

        // Order book section
        case 'best':
            return <BestTip className="label">{children}</BestTip>;

        // Insurance pools section
        case 'current-apy':
            return <CurrentAPYTip className="label">{children}</CurrentAPYTip>;
        case 'pool-ownership':
            return <PoolOwnershipTip className="label">{children}</PoolOwnershipTip>;
        case 'buffer':
            return <BufferTip className="label">{children}</BufferTip>;
        case 'public':
            return <PublicTip className="label">{children}</PublicTip>;

        case 'etherscan-link':
            return <EtherscanLinkTip className="label">{children}</EtherscanLinkTip>;
        case 'adjust-position':
            return (
                <AdjustPositionTip className="label" baseTicker={tooltip.props?.baseTicker ?? ''}>
                    {children}
                </AdjustPositionTip>
            )
        case 'new-order':
            return (
                <NewOrderTip className="label" baseTicker={tooltip.props?.baseTicker ?? ''}>
                    {children}
                </NewOrderTip >
            )
        default:
            return <StyledTooltip className="label">{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
