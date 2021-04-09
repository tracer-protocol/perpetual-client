/**
 * Fetches last 200 trade history of a user from the graph
 * @param user user address
 */
export const tradeHistory: (user: string) => string = (user) => {
    return `{
            trader(id: "${user.toLowerCase()}") {
                id
                trades(first:200, orderBy: timestamp, orderDirection: desc) {
                    id
                    timestamp
                    amount
                    order {
                        price
                        priceMultiplier
                        tracer {
                            marketId
                        }
                    }
                    position
                }
            }
    }`;
};

/**
 *
 * @param tracerId tracer market ID eg TCR/USD
 */
export const insuranceInfo: (tracerId: string) => string = (tracerId) => {
    return `{
            insurancePool(id: "${process.env.NEXT_PUBLIC_INSURANCE_ADDRESS?.toLowerCase()}-${tracerId.toLowerCase()}") {
                id
                asset
                holders(orderBy: amount, orderDirection: desc) {
                    id
                    trader {
                        id
                    }
                    timestamp
                    amount
                }
                liquidity
            }
        }`;
};

export const userInsuranceInfo: (tracerId: string, user: string) => string = (tracerId, user) => {
    return `{
            trader(id: "${user}") {
                historics(where: {targetPoolType: INSURANCE, tracer: "${tracerId}"}) {
                    amount
                    timestamp
                }
            }
        }`;
};

export const allUserOrders: (user: string) => string = (user) => {
    return ` {
            trader(id: ${user}) {
                id
                createdOrders {
                    id
                    amount
                    status
                    price
                    filled
                    tracer
                    takers {
                        id
                    }
                }
                takenOrders {
                    id
                    trader
                    order
                    amounts
                }
            }
        }`;
};
