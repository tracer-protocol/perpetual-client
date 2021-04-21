/**
 * Utils library, basically models the logic of the solidity libraries
 *
 */

// const FEED_UNIT_DIVIDER = 10e7; //used to normalise gas feed prices for margin calcs
// const MARGIN_MUL_FACTOR = 10000; //Factor to keep precision in margin calcs
const RYAN_6 = 6; // a number accredited to our good friend Ryan Garner
const LIQUIDATION_GAS_COST = 25; // When gas price is 250 gwei and eth price is 1700, the liquidation gas cost is 25 USD.

// const LIQUIDATION_PERCENTAGE = 0.075; // liquidation percentage of 7.5%

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

export const calcLeverage: (
    base: number, quote: number, fairPrice: number
) => number = (base, quote, fairPrice) =>   {
    if (calcNotionalValue(quote, fairPrice) < 0.000001) { // TODO update this since highly likely for something like BTC/USD
        return 0;
    }
    return calcNotionalValue(quote, fairPrice) / totalMargin(quote, base, fairPrice)
}

/**
 * A function that returns the liquidation price for a given account
 * @param value
 */
export const calcLiquidationPrice: (
    base: number, 
    quote: number,
    fairPrice: number,
    maxLeverage: number
) => number = (base, quote, fairPrice,  maxLeverage, ) => {
    if (calcNotionalValue(quote, fairPrice) < 0.000001) { // TODO update this since highly likely for something like BTC/USD
        return 0;
    }
    const borrowed = calcBorrowed(base, quote, fairPrice)
    if (borrowed > 0 || quote < 0) {
        return (
            quote > 0 // case 1
                ? (maxLeverage * (base - RYAN_6 * LIQUIDATION_GAS_COST) / (quote - maxLeverage * quote))
                : 0
            + 
            quote < 0 // case 2
                ? (-1 * (base * maxLeverage - RYAN_6 * LIQUIDATION_GAS_COST * maxLeverage) / (maxLeverage * quote + quote))
                : 0
        )
    } else {
        return 0;
    }
};

/**
 * A function that returns the liquidation price for a given account
 * @param value
 */
export const calcProfitableLiquidationPrice: (
    base: number, 
    quote: number,
    fairPrice: number,
    maxLeverage: number
) => number = (base, quote, fairPrice,  maxLeverage, ) => {
    const margin = totalMargin(quote, base, fairPrice);
    const borrowed = calcBorrowed(base, quote, fairPrice)
    if (borrowed > 0 || margin < 0) {
        return (
            base > 0 // case 1
                ? (maxLeverage * (quote - ((RYAN_6 * LIQUIDATION_GAS_COST) - LIQUIDATION_GAS_COST)) / (base - (maxLeverage * base)))
                : 0
            + 
            base < 0 // case 2
                ? (-1 * (quote * (maxLeverage - ((RYAN_6 * LIQUIDATION_GAS_COST - LIQUIDATION_GAS_COST) * maxLeverage)) / (maxLeverage * base + base)))
                : 0
        )
    } else {
        return 0;
    }
};

export const accountGain: (margin: number, deposited: number) => number = (margin, deposited) => {
    return margin - deposited;
};

export const calcBorrowed: (
    base: number, quote: number, fairPrice: number
) => number = (base, quote, fairPrice) => Math.max(0, calcNotionalValue(quote, fairPrice) - totalMargin(quote, base, fairPrice))


export const calcWithdrawable: (
    quote: number, base: number, fairPrice: number, maxLeverage: number
) => number = (quote, base, fairPrice, maxLeverage) =>  {
    const notional = calcNotionalValue(quote, fairPrice);
    const margin = totalMargin(quote, base, fairPrice) 
    if (notional < 0.0001) {
        // TODO this is an error when the users position is so small its negligable
        return margin - 0.0001; // ignore the liquidation cost
    }
    return margin - (quote !== 0 ? LIQUIDATION_GAS_COST * RYAN_6 + calcNotionalValue(quote, fairPrice) / maxLeverage : 0)

}

/**
 * Calculates the notional value of the position
 * @param quote position amount in units of quote 
 * @param fairPrice fair price of quote 
 * @returns 
 */
export const calcNotionalValue: (quote: number, fairPrice: number) => number = (quote, fairPrice) => {
    return Math.abs(quote) * fairPrice;
}

/**
 * Calculates the minimum margin required for a given position and price
 * @param margin cost of liquidation
 * @param quote amount of quote
 * @param fairPrice the quote is being traded at
 * @returns the minimum margin required
 */
export const calcMinimumMargin: (
    base:number, quote: number, fairPrice: number, maxLeverage: number
) => number = (base, quote, fairPrice, maxLeverage) => {
    const margin = totalMargin(quote, base, fairPrice)
    if (calcNotionalValue(quote, fairPrice) < 0.000001) { // TODO update this since highly likely for something like BTC/USD
        return 0;
    }
    if (margin > 0 || quote < 0) {
        return LIQUIDATION_GAS_COST * RYAN_6 + calcNotionalValue(quote, fairPrice) / maxLeverage
    } else return 0;
}

export const totalMargin: (
    quote: number, base: number, fairPrice: number
) => number = (quote, base, fairPrice) => base + (quote * fairPrice)

// order prices are in cents * 1000
// so converstion is fromCents(price / (100 * 1000))
// toCents(price * 100 * 1000)
export const fromCents: (val: number) => number = (val) => {
    return val / (100 * 10000);
};
