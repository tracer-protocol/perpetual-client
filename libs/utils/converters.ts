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

export const toApproxCurrency: (str: string | number) => string = (str) => {
    return str
        .toLocaleString('en-us', {
            style: 'currency',
            currency: 'USD',
        })
        .replace('-', '~');
};
