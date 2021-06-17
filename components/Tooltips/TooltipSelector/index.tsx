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
} from '@components/Tooltips';

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
        | 'unrealised-pnl';
    props?: {
        baseTicker?: string;
        availableMargin?: number;
        maxLeverage?: number;
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

        // Position account section
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

        default:
            return <StyledTooltip className="label">{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
