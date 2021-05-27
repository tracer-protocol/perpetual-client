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

export const timeAgo = (current: number, previous: number) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;

    if (elapsed < msPerMinute) return Math.round(elapsed/1000) + 's';   
    else if (elapsed < msPerHour) return Math.round(elapsed/msPerMinute) + 'm';   
    else if (elapsed < msPerDay ) return Math.round(elapsed/msPerHour ) + 'h';   
    else if (elapsed < msPerMonth) return Math.round(elapsed/msPerDay) + 'd';   
    else if (elapsed < msPerYear) return Math.round(elapsed/msPerMonth) + 'm';   
    else return Math.round(elapsed/msPerYear ) + 'y';   
}
