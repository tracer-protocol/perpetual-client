import { FilledOrder } from '@libs/types/OrderTypes';
import { BigNumber } from 'bignumber.js';
import Web3 from 'web3';

/**
 * Simple func to convert a number to a percentage by multiplying
 *  it by 100 and returning the string
 * Fixes the return to two decimal places.
 * @param
 * @returns 0.00% if the number is NaN < 0.001 for very small percentages and the percentage otherwise
 */
export const toPercent: (value: number) => string = (value) => {
    if (Number.isNaN(value) || !value) {
        return '0.00%';
    }
    const percentage = value * 100;
    if (percentage < 0.001) {
        return '< 0.001%';
    }
    return `${percentage.toFixed(2)}%`;
};

/**
 * Rounds the number to a given amount of decimal places
 * @param num number to round
 * @param decimalPlaces number of decimal places
 * @returns the rounded number
 */
export const round: (num: number, decimalPlaces: number) => number = (num, decimalPlaces) => {
    const p = Math.pow(10, decimalPlaces);
    const n = num * p * (1 + Number.EPSILON);
    return Math.round(n) / p;
};

/**
 * Returns a currency representation of a given number or BigNumber
 * @param num_ number to convert to currency
 * @param precision number of decimals / precision to use
 * @returns returns the LocaleString representation of the value
 */
export const toApproxCurrency: (num_: BigNumber | number, precision?: number) => string = (num_, precision) => {
    let num = num_;
    if (typeof num !== 'number' && num) {
        num = (num_ as BigNumber)?.toNumber();
    }
    if (!num) {
        // reject if num is falsey
        return '$0.00';
    }
    return num.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: precision ?? 2,
    });
};

/**
 * Gets the position text based on an account balance
 * @param balance base balance
 * @returns text corresponding to position
 */
export const getPositionText: (balance: BigNumber) => 'NONE' | 'SHORT' | 'LONG' = (balance) => {
    if (balance.eq(0)) {
        return 'NONE';
    } else if (balance.lt(0)) {
        return 'SHORT';
    } else {
        return 'LONG';
    }
};

/**
 * Calculates how much time has passed between two timestamps
 * @param current current timestamp
 * @param previous target timestamp
 * @returns the amount of time that has elapsed between previous and current
 */
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

/**
 * Formats a given date into HH:MM:SS
 * @param date Object to format
 * @returns string of HH:MM:SS
 */
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

const ten = new BigNumber(10);
/**
 * Converts a BigNumber to Wei without losing precision by converting it to js number.
 * This is because BigNumber.toString() will actually convert to js number first and loses precision.
 * You can get around this by doing it this way, or be setting the BigNumber config
 * @param num BigNumber to convert
 * @returns string representation of the BigNumber in wei
 */
export const bigNumberToWei: (num: BigNumber) => string = (num) => {
    // remove anything after a decimal if there is any
    try {
        return num.times(ten.pow(18)).toFixed().split('.')[0];
    } catch (err) {
        console.error('Failed to convert number to wei', err);
        return '0';
    }
};

/**
 * Converts a list of orders with amount and price to nonWei amount and price orders
 * @param orders list of orders to convert
 * @returns a list of FilledOrder Objects
 */
export const toBigNumbers: (
    orders: {
        amount: string;
        price: string;
    }[],
) => FilledOrder[] = (orders) =>
    orders.map((order: any) => ({
        ...order,
        amount: new BigNumber(Web3.utils.fromWei(order.amount)),
        price: new BigNumber(Web3.utils.fromWei(order.price)),
    }));
