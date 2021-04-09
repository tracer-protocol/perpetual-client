import { useState, useEffect } from 'react';
import PricingContract from '@libs/Pricing';
import { FundingRate } from 'types';

type UseRate = (pricing: PricingContract, market: string) => FundingRate;

/**
 *
 * @param pricing contract class instance
 * @param market tracer market
 *
 */
export const useFundingRate: UseRate = (pricing, market) => {
    const [fundingRate, setFundingRate] = useState<FundingRate>({
        fundingRate: 0,
        recordTime: 0,
        recordPrice: 0,
        fundingRateValue: 0,
    });
    useEffect(() => {
        if (pricing && market) {
            Promise.resolve(pricing.getFundingRate(market)).then((fundingRate) => {
                setFundingRate(fundingRate);
            });
        }
    }, [pricing, market]);

    return fundingRate;
};

/**
 *
 * @param pricing contract class instance
 * @param market tracer market
 */
export const useInsuranceFundingRate: UseRate = (pricing, market) => {
    const [fundingRate, setFundingRate] = useState<FundingRate>({
        fundingRate: 0,
        recordTime: 0,
        recordPrice: 0,
        fundingRateValue: 0,
    });
    useEffect(() => {
        if (pricing && market) {
            Promise.resolve(pricing.getInsuranceFundingRate(market)).then((fundingRate) => {
                setFundingRate(fundingRate);
            });
        }
    }, [pricing, market]);

    return fundingRate;
};
