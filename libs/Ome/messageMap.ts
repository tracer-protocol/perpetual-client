// https://www.notion.so/tracerdao/4345ae29b90047be87637f760d5aa6a5?v=713a9e612b8847ffbd4a247223bea9dc

export const errors: Record<string, string> = {
    invalid_signature: 'Invalid signature',
    under_margin: 'Not enough margin',
    invalid_created_timestamp: 'Invalid creation timestamp',
    invalid_expiry_timestamp: 'Invalid expiry timestamp',
    not_whitelisted: 'Account not whitelisted',
};

export const ok: Record<string, string> = {
    placed: 'Order successfully placed',
    fully_matched: 'Order fully matched',
    partially_matched: 'Order partially matched',
    cancelled: 'Order successfully cancelled',
};
