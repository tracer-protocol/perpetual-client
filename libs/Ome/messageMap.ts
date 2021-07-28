import { API_CODES } from '@tracer-protocol/tracer-utils';
// https://www.notion.so/tracerdao/4345ae29b90047be87637f760d5aa6a5?v=713a9e612b8847ffbd4a247223bea9dc

export const errors: Record<string, string> = {
    [API_CODES.INVALID_SIGNATURE]: 'Invalid signature',
    [API_CODES.UNDER_MARGIN]: 'Not enough margin',
    [API_CODES.INVALID_CREATED_TIMESTAMP]: 'Invalid creation timestamp',
    [API_CODES.INVALID_EXPIRY_TIMESTAMP]: 'Invalid expiry timestamp',
    [API_CODES.NOT_WHITELISTED]: 'Account not whitelisted',
};

export const ok: Record<string, string> = {
    [API_CODES.ORDER_PLACED]: 'Order successfully placed',
    [API_CODES.ORDER_FULLY_MATCHED]: 'Order fully matched',
    [API_CODES.ORDER_PARTIALLY_MATCHED]: 'Order partially matched',
    [API_CODES.ORDER_CANCELLED]: 'Order successfully cancelled',
};
