import { BigNumber } from 'bignumber.js';

/**
 * Simple func to convert a number to a percentage by multiplying
 *  it by 10 and returning the string
 * @param value
 */
export const toPercent: (value: number) => string = (value) => {
    return `${round(value) * 100} %`;
};

/**
 * rounds the number based on its epsilon, eg 10e2
 * @param value value to be rounded
 */
export const round: (value: number) => number = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};

/**
 * Custom to locale which replaces - with ~
 */

export const toApproxCurrency: (num_: BigNumber | number) => string = (num_) => {
    let num = num_;
    if (typeof num !== 'number') {
        num = (num_ as BigNumber).toNumber();
    }
    return num.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
    });
};

// order prices are in cents * 1000
// so converstion is fromCents(price / (100 * 1000))
// toCents(price * 100 * 1000)
export const fromCents: (val: number) => number = (val) => {
    return val / (100 * 10000);
};
