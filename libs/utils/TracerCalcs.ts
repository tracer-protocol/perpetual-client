/**
 * Utils library, basically models the logic of the solidity libraries
 *
 */

import { OpenOrder, TakenOrder } from '@components/types';

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

export const calcLeverage: (quote: number, base: number, fairPrice: number) => number = (quote, base, fairPrice) => {
    if (calcNotionalValue(base, fairPrice) < 0.000001) {
        // TODO update this since highly likely for something like BTC/USD
        return 0;
    }
    return calcNotionalValue(base, fairPrice) / totalMargin(base, quote, fairPrice);
};

/**
 * A function that returns the liquidation price for a given account
 * @param value
 */
export const calcLiquidationPrice: (quote: number, base: number, fairPrice: number, maxLeverage: number) => number = (
    quote,
    base,
    fairPrice,
    maxLeverage,
) => {
    if (calcNotionalValue(base, fairPrice) < 0.000001) {
        // TODO update this since highly likely for something like BTC/USD
        return 0;
    }
    const borrowed = calcBorrowed(quote, base, fairPrice);
    if (borrowed > 0 || base < 0) {
        return base > 0 // case 1
            ? (maxLeverage * (quote - RYAN_6 * LIQUIDATION_GAS_COST)) / (base - maxLeverage * base)
            : 0 + base < 0 // case 2
            ? (-1 * (quote * maxLeverage - RYAN_6 * LIQUIDATION_GAS_COST * maxLeverage)) / (maxLeverage * base + base)
            : 0;
    } else {
        return 0;
    }
};

/**
 * A function that returns the liquidation price for a given account
 * @param value
 */
export const calcProfitableLiquidationPrice: (
    quote: number,
    base: number,
    fairPrice: number,
    maxLeverage: number,
) => number = (quote, base, fairPrice, maxLeverage) => {
    const margin = totalMargin(base, quote, fairPrice);
    const borrowed = calcBorrowed(quote, base, fairPrice);
    if (borrowed > 0 || margin < 0) {
        return quote > 0 // case 1
            ? (maxLeverage * (base - (RYAN_6 * LIQUIDATION_GAS_COST - LIQUIDATION_GAS_COST))) /
                  (quote - maxLeverage * quote)
            : 0 + quote < 0 // case 2
            ? -1 *
              ((base * (maxLeverage - (RYAN_6 * LIQUIDATION_GAS_COST - LIQUIDATION_GAS_COST) * maxLeverage)) /
                  (maxLeverage * quote + quote))
            : 0;
    } else {
        return 0;
    }
};

export const accountGain: (margin: number, deposited: number) => number = (margin, deposited) => {
    return margin - deposited;
};

export const calcBorrowed: (quote: number, base: number, fairPrice: number) => number = (quote, base, fairPrice) =>
    Math.max(0, calcNotionalValue(base, fairPrice) - totalMargin(base, quote, fairPrice));

export const calcWithdrawable: (base: number, quote: number, fairPrice: number, maxLeverage: number) => number = (
    base,
    quote,
    fairPrice,
    maxLeverage,
) => {
    const notional = calcNotionalValue(base, fairPrice);
    const margin = totalMargin(base, quote, fairPrice);
    if (notional < 0.0001) {
        // TODO this is an error when the users position is so small its negligable
        return margin - 0.0001; // ignore the liquidation cost
    }
    return (
        margin - (base !== 0 ? LIQUIDATION_GAS_COST * RYAN_6 + calcNotionalValue(base, fairPrice) / maxLeverage : 0)
    );
};

/**
 * Calculates the notional value of the position
 * @param base position amount in units of base
 * @param fairPrice fair price of base
 * @returns
 */
export const calcNotionalValue: (base: number, fairPrice: number) => number = (base, fairPrice) => {
    return Math.abs(base) * fairPrice;
};

/**
 * Calculates the minimum margin required for a given position and price
 * @param margin cost of liquidation
 * @param base amount of base
 * @param fairPrice the base is being traded at
 * @returns the minimum margin required
 */
export const calcMinimumMargin: (quote: number, base: number, fairPrice: number, maxLeverage: number) => number = (
    quote,
    base,
    fairPrice,
    maxLeverage,
) => {
    const margin = totalMargin(base, quote, fairPrice);
    if (calcNotionalValue(base, fairPrice) < 0.000001) {
        // TODO update this since highly likely for something like BTC/USD
        return 0;
    }
    if (margin > 0 || base < 0) {
        return LIQUIDATION_GAS_COST * RYAN_6 + calcNotionalValue(base, fairPrice) / maxLeverage;
    } else {
        return 0;
    }
};

export const totalMargin: (base: number, quote: number, fairPrice: number) => number = (base, quote, fairPrice) =>
    quote + base * fairPrice;

// order prices are in cents * 1000
// so converstion is fromCents(price / (100 * 1000))
// toCents(price * 100 * 1000)
export const fromCents: (val: number) => number = (val) => {
    return val / (100 * 10000);
};

/**
 * Calculates a theoretical market exposure if it took all the 'best' orders it could
 *  Returns this exposure and the orders that allow it to gain this exposure
 * @param rMargin margin entered to use by the user
 * @param leverage leverage of the trade
 */
export const calcExposure: (
    rMargin: number,
    leverage: number,
    orders: OpenOrder[],
) => { exposure: number; takenOrders: TakenOrder[]; tradePrice: number } = (rMargin, leverage, orders) => {
    if (orders.length) {
        // const oppositeOrders = position ? openOrders[0] : openOrders[1];
        let exposure = 0,
            totalUnitPrice = 0,
            units = 0;
        const takenOrders: TakenOrder[] = [];
        let deposit = rMargin * leverage; // units of underlying
        for (const order of orders) {
            const orderR = order.amount - order.filled; // units of asset
            const orderPrice = order.price;
            const r = deposit - orderR * orderPrice;
            if (r >= 0) {
                // if it can eat the whole order
                totalUnitPrice += orderPrice * orderR;
                units += orderR;
                exposure += orderR; // units of the assets
                deposit -= orderR * orderPrice; // subtract the remainder in units of underLying
                takenOrders.push({
                    id: order.id,
                    amount: orderR,
                    price: order.price,
                });
            } else {
                // eat a bit of the order nom nom
                if (deposit) {
                    totalUnitPrice += deposit;
                    units += deposit / orderPrice;
                    exposure += deposit / orderPrice;
                    takenOrders.push({
                        id: order.id,
                        amount: deposit / orderPrice, // take what is yours
                        price: order.price,
                    });
                }
                break;
            }
        }

        return {
            exposure: parseFloat(exposure.toFixed(10)),
            takenOrders: takenOrders,
            tradePrice: units ? totalUnitPrice / units : orders[0].price,
        };
    }
    return {
        exposure: 0,
        takenOrders: [],
        tradePrice: 0,
    };
};
