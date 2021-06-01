import { OMEOrder } from "@tracer-protocol/tracer-utils"


export const calcStatus: (order: OMEOrder) => 
    'Unfilled' | 'Partially Filled'
= ({ amount }) => {
    if (amount) { // if amount === filled
        return 'Unfilled'
    }
    return 'Partially Filled'
}