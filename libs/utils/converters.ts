import { BigNumber } from 'bignumber.js';

const getPrecision: (a: number) => number = (a) => {
    if (!isFinite(a)) {
        return 0;
    }
    let e = 1,
        p = 0;
    while (Math.round(a * e) / e !== a) {
        e *= 10;
        p++;
    }
    return p;
};

/**
 * Simple func to convert a number to a percentage by multiplying
 *  it by 10 and returning the string
 * @param value
 */
export const toPercent: (value: number) => string = (value) => {
    return `${value * 100} %`;
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
    if (!num_) {
        // reject if num is falsey
        return '$0.000000';
    }
    if (typeof num !== 'number') {
        num = (num_ as BigNumber).toNumber();
    }
    return num.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: Math.min(getPrecision(num), 6),
    });
};

// order prices are in cents * 1000
// so converstion is fromCents(price / (100 * 1000))
// toCents(price * 100 * 1000)
export const fromCents: (val: number) => number = (val) => {
    return val / (100 * 10000);
};

export const timeAgo: (current: number, previous: number) => string = (current, previous) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + 's';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + 'm';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + 'h';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + 'd';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + 'm';
    } else {
        return Math.round(elapsed / msPerYear) + 'y';
    }
};

export const formatDate: (date: Date) => string = (date) =>
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

export const isVerySmall: (num: BigNumber, currency: boolean) => string = (num, currency) => {
    const isSmall = num.lt(0.000001); // some arbitrarily small number
    if (currency) {
        if (isSmall && num.eq(0)) {
            return `≈ ${toApproxCurrency(0)}`;
        } else {
            return toApproxCurrency(num);
        }
    } else {
        if (isSmall && !num.eq(0)) {
            return `≈ ${num.toFixed(4)}`;
        } else {
            return `${num.toFixed(4)}`;
        }
    }
};
