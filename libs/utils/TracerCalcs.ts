/**
 * Utils library, basically models the logic of the solidity libraries
 *
 */

const FEED_UNIT_DIVIDER = 10e7; //used to normalise gas feed prices for margin calcs
const MARGIN_MUL_FACTOR = 10000; //Factor to keep precision in margin calcs
const RYAN_6 = 6; // a number accredited to our good friend Ryan Garner

const LIQUIDATION_PERCENTAGE = 0.075; // liquidation percentage of 7.5%

/**
* @notice Calculates the new margin and position given trade details. Assumes the entire trade will execute
        to calculate the new margin and position.
* @param currentMargin the users current margin account balance
* @param currentPosition the users current position balance
* @param amount the amount of positions being purchased in this trade
* @param price the price the positions are being purchased at
* @param side the side of the order (true for LONG, false for SHORT)
* @param priceMultiplier the price multiplier used for the tracer contract the calc is being run for
* @param feeRate the current fee rate of the tracer contract the calc is being run for
*/

export const safeCalcTradeMargin: (
    cMargin: number,
    cPosition: number,
    amount: number,
    price: number,
    side: boolean,
    priceMultiplier: number,
    feeRate: number,
) => { margin: number; position: number } = (cMargin, cPosition, amount, price, side, priceMultiplier, feeRate) => {
    //Get margin change and fee if present
    const marginChange = (amount * Math.abs(price)) / priceMultiplier;
    const fee = (marginChange * feeRate) / priceMultiplier;
    if (side) {
        //LONG
        cPosition += amount;
        cMargin -= marginChange + fee;
    } else {
        //SHORT
        cPosition -= amount;
        cMargin += marginChange - fee;
    }
    return { margin: cMargin, position: cPosition };
};

/**
 * Basic helper function to calculate the users margin and position value relative to the price
 * @param margin
 * @param position
 * @param price
 * @param priceMultiplier
 */
export const calcMarginPositionValue: (
    margin: number,
    position: number,
    price: number,
    priceMultiplier: number,
) => { marginValue: number; positionValue: number } = (margin, position, price, priceMultiplier) => {
    let marginValue = 0;
    let positionValue = 0;
    marginValue = Math.abs(margin) * priceMultiplier * MARGIN_MUL_FACTOR;
    positionValue = Math.abs(position) * price;

    return { marginValue, positionValue };
};

/**
 * @notice Calculates margin given a margin account and position. Returns 100% if there is no negative value
 *         in the account. Does not throw if the margin is negative
 * @param margin the users current margin account balance
 * @param position the users current position balance
 * @param price the price for the margin calculation to be run at
 * @param gasCost is the last updatedGasPrice in ETH. It is a product of lastUpdatedGasCost
 *  and the tracers liquidationGasCost
 * @param priceMultiplier the price multiplier used for the tracer contract the calc is being run for
 */
export const calcMargin: (
    margin: number,
    position: number,
    price: number,
    gasCost: number,
    priceMultiplier: number,
) => number = (margin, position, price, gasCost, priceMultiplier) => {
    const { marginValue, positionValue } = calcMarginPositionValue(margin, position, price, priceMultiplier);
    const mulGasCost = (RYAN_6 * gasCost * priceMultiplier * MARGIN_MUL_FACTOR) / FEED_UNIT_DIVIDER;

    //Edge cases
    if (position === 0) {
        if (margin < 0) {
            //negative margin on no position, not allowed
            return 0;
        }
        return 100;
    }

    //Gas cost is considered part of the minimum value
    //and is factored into the margin of each account
    let marginPercent = 0;
    if (position > 0) {
        if (margin > 0) {
            //over collateralised, simply return 100%
            marginPercent = 100;
        } else {
            //long
            const nonDivided = (marginValue + mulGasCost) / positionValue;
            marginPercent = MARGIN_MUL_FACTOR / nonDivided;
        }
    } else {
        if (margin <= 0) {
            //position < 0, margin <= 0, reject
            marginPercent = 0;
        } else {
            //short
            const nonDivided = (marginValue - mulGasCost) / positionValue;
            marginPercent = nonDivided / MARGIN_MUL_FACTOR;
        }
    }
    return marginPercent;
};

/**
 * @notice Calculates the positive and negative balances for an account.
 * @param margin the users current margin account balance
 * @param position the users current position balance
 * @param price the price to calculate the positive and negative balances at
 * @param priceMultiplier the price multiplier for the specific tracer contract.
 */
export const calcPositiveNegative: (
    margin: number,
    position: number,
    price: number,
    priceMultiplier: number,
) => { positiveValue: number; negativeValue: number } = (margin, position, price, priceMultiplier) => {
    let positiveValue = 0;
    let negativeValue = 0;

    if (margin >= 0) {
        positiveValue += margin * priceMultiplier;
    } else {
        negativeValue += Math.abs(margin) * priceMultiplier;
    }

    if (position >= 0) {
        positiveValue += position * price;
    } else {
        negativeValue += Math.abs(position) * price;
    }

    return { positiveValue, negativeValue };
};

/**
 * @notice Calculates an accounts leveraged notional value
 */
export const calcLeveragedNotionalValue: (
    position: number,
    deposited: number,
    price: number,
    priceMultiplier: number,
) => number = (position, deposited, price, priceMultiplier) => {
    // Calc new leveraged notional value
    return (Math.abs(position) * price) / priceMultiplier / deposited;
};

/**
 * A function that returns the liquidation price for a given account
 * @param value
 */
export const liquidationPrice: (value: number) => number = (value) => {
    return value;
};

export const accountGain: (margin: number, deposited: number) => number = (margin, deposited) => {
    return margin - deposited;
};

/**
 * A function that calculates the unrealised pnl, this is based
 * on open orders
 */
export const realisedPnL: () => number = () => {
    return 999;
};

/**
 * Function to calculate the users available margin
 * @param cMargin current margin
 * @param cPosition current position
 */
export const availableMargin: (cMargin: number, cPosition: number) => number = (cMargin, cPosition) => {
    return cMargin - Math.abs(cPosition) - LIQUIDATION_PERCENTAGE * cMargin;
};

// order prices are in cents * 1000
// so converstion is fromCents(price / (100 * 1000))
// toCents(price * 100 * 1000)
export const fromCents: (val: number) => number = (val) => {
    return val / (100 * 10000);
};
