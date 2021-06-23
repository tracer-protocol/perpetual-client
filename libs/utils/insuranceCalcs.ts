/**
 * The insurance health is a simple percentage of how full the insurance pool is relative to its target
 * @param target Insurance pool target
 * @param liquidity Current insurance pool funds
 * @returns a percentile health representation of the pool
 */
export const calcInsurancePoolHealth: (
    target: number | undefined,
    liquidity: number | undefined,
) => number = (target, liquidity) => {
    if (!target || !liquidity) {
        return 0;
    }
    return liquidity / target;
};
