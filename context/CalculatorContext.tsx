import React, { useContext, useReducer } from 'react';
import { Children } from 'libs/types';
import { LONG, SHORT } from 'libs/types/OrderTypes';
import {
    calcFromExposureAndLeverage,
    calcFromExposureAndLiquidation,
    calcFromExposureAndMargin,
    calcFromLeverageAndLiquidation,
    calcFromMarginAndLeverage,
    calcFromMarginAndLiquidation,
} from '@tracer-protocol/tracer-utils';
import BigNumber from 'bignumber.js';
import { TracerContext } from './TracerContext';
import { defaults } from '@libs/Tracer';
import { PositionVars } from '@tracer-protocol/tracer-utils/dist/Types/calculator';
import { ErrorKey } from '@components/General/Error';
import { isWithinRange } from '@libs/utils';
export interface ContextProps {
    calculatorState: CalculatorState;
    calculatorDispatch: React.Dispatch<CalculatorAction>;
}

export const CalculatorContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

// Implemented like this as addition of any two of these values is unique
//  this makes it easier when calculating and keeping track of which inputs are locked
export const LOCK_EXPOSURE = 0;
export const LOCK_MARGIN = 1;
export const LOCK_LEVERAGE = 2;
export const LOCK_LIQUIDATION = 4;

type CalculatorState = {
    exposure: number;
    margin: number;
    liquidationPrice: number;
    leverage: number;
    position: typeof LONG | typeof SHORT;
    displayLocks: boolean;
    locked: number[]; // functions like a stack
    error: ErrorKey;
};

export type CalculatorAction =
    | { type: 'setExposure'; value: number }
    | { type: 'setLiquidationPrice'; value: number }
    | { type: 'setMaxLiquidationPrice' }
    | { type: 'setLeverage'; value: number }
    | { type: 'setMargin'; value: number }
    | { type: 'setError'; value: ErrorKey }
    | { type: 'lockValue'; value: number }
    | { type: 'unlockValue'; value: number }
    | { type: 'setPosition' }
    | { type: 'calculate' }
    | { type: 'reset' };

type StoreProps = {
    tracer?: string;
} & Children;

const defaultState: CalculatorState = {
    exposure: NaN,
    margin: NaN,
    leverage: 1,
    liquidationPrice: NaN,
    position: LONG,
    displayLocks: true,
    locked: [],
    error: 'NO_ERROR',
};
export const CalculatorStore: React.FC<StoreProps> = ({ children }: StoreProps) => {
    const { selectedTracer } = useContext(TracerContext);

    const initialState: CalculatorState = {
        exposure: NaN,
        margin: NaN,
        leverage: 1,
        liquidationPrice: NaN,
        position: LONG,
        displayLocks: true,
        locked: [],
        error: 'NO_ERROR',
    };

    const reducer = (state: CalculatorState, action: CalculatorAction) => {
        switch (action.type) {
            case 'setExposure':
                return { ...state, exposure: action.value };
            case 'setMargin':
                return { ...state, margin: action.value };
            case 'setLiquidationPrice':
                return { ...state, liquidationPrice: action.value };
            case 'setMaxLiquidationPrice':
                return {
                    ...state,
                };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setPosition':
                return {
                    ...state,
                    position: (state.position === LONG ? SHORT : LONG) as typeof LONG | typeof SHORT,
                };
            case 'setError':
                return { ...state, error: action.value };
            case 'lockValue':
                const locked = state.locked;
                if (locked[0] === action.value || locked[1] === action.value) {
                    return {
                        ...state,
                    };
                }
                if (locked.length <= 1) {
                    locked.push(action.value);
                } else {
                    locked[0] = locked[1];
                    locked[1] = action.value;
                }
                return {
                    ...state,
                    locked: locked,
                };

            case 'unlockValue':
                const filteredLocked = state.locked.filter((val) => val !== action.value);
                return {
                    ...state,
                    locked: filteredLocked,
                };
            case 'calculate': {
                if (state.locked.length < 2) {
                    return {
                        ...state,
                        error: 'INVALID_INPUTS_2',
                    };
                } else if (isLockedAndFalsey(state.locked, state.exposure, state.margin, state.liquidationPrice)) {
                    return {
                        ...state,
                        error: 'ZEROED_INPUTS',
                    };
                }
                const result = getResult(
                    state,
                    selectedTracer?.getFairPrice() ?? defaults.fairPrice,
                    selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage,
                );
                const error = checkErrors(
                    state,
                    result,
                    selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage,
                    selectedTracer?.getFairPrice() ?? defaults.fairPrice,
                    selectedTracer?.getBalance().tokenBalance ?? defaults.balances.tokenBalance,
                );
                return {
                    ...state,
                    exposure: parseFloat(result.exposure.toFixed(5)),
                    liquidationPrice: parseFloat(result.liquidationPrice.toFixed(5)),
                    leverage: parseFloat(result.leverage.toFixed(1)),
                    margin: parseFloat(result.margin.toFixed(5)),
                    error: error,
                };
            }
            case 'reset': {
                return { ...defaultState, locked: [] };
            }
            default:
                throw new Error('Unexpected action');
        }
    };

    const [calculatorState, calculatorDispatch] = useReducer(reducer, initialState);

    return (
        <CalculatorContext.Provider
            value={{
                calculatorState,
                calculatorDispatch,
            }}
        >
            {children}
        </CalculatorContext.Provider>
    );
};

const getResult: (state: CalculatorState, fairPrice: BigNumber, maxLeverage: BigNumber) => PositionVars = (
    state,
    fairPrice,
    maxLeverage,
) => {
    switch (state.locked[0] + state.locked[1]) {
        case LOCK_EXPOSURE + LOCK_MARGIN: // 0 and 1
            return calcFromExposureAndMargin(
                new BigNumber(state.exposure),
                new BigNumber(state.margin),
                fairPrice,
                maxLeverage,
                state.position === LONG,
            );
        case LOCK_EXPOSURE + LOCK_LEVERAGE: // 0 and 2
            return calcFromExposureAndLeverage(
                new BigNumber(state.exposure),
                new BigNumber(state.leverage),
                fairPrice,
                maxLeverage,
                state.position === LONG,
            );
        case LOCK_EXPOSURE + LOCK_LIQUIDATION: // 0 and 4
            return calcFromExposureAndLiquidation(
                new BigNumber(state.exposure),
                new BigNumber(state.liquidationPrice),
                fairPrice,
                maxLeverage,
                state.position === LONG,
            );
        case LOCK_MARGIN + LOCK_LEVERAGE: // 1 and 2
            return calcFromMarginAndLeverage(
                new BigNumber(state.margin),
                new BigNumber(state.leverage),
                fairPrice,
                maxLeverage,
                state.position === LONG,
            );
        case LOCK_MARGIN + LOCK_LIQUIDATION: // 1 and 4
            return calcFromMarginAndLiquidation(
                new BigNumber(state.margin),
                new BigNumber(state.liquidationPrice),
                fairPrice,
                maxLeverage,
                state.position === LONG,
            );
        case LOCK_LEVERAGE + LOCK_LIQUIDATION: // 2 and 4
            return calcFromLeverageAndLiquidation(
                new BigNumber(state.leverage),
                new BigNumber(state.liquidationPrice),
                fairPrice,
                maxLeverage,
                state.position === LONG,
            );
        default:
            return {
                exposure: new BigNumber(0),
                liquidationPrice: new BigNumber(0),
                margin: new BigNumber(0),
                leverage: new BigNumber(0),
            };
    }
};

const isLockedAndFalsey = (locked: number[], exposure: number, margin: number, liquidationPrice: number) => {
    for (const lockedKey of locked) {
        if (lockedKey === LOCK_EXPOSURE && !exposure) {
            return true;
        }
        if (lockedKey === LOCK_MARGIN && !margin) {
            return true;
        }
        if (lockedKey === LOCK_LIQUIDATION && !liquidationPrice) {
            return true;
        }
    } // else
    return false;
};

const invalidLiquidationPrice: (
    position: typeof LONG | typeof SHORT,
    liquidationPrice: BigNumber,
    fairPrice: BigNumber,
) => boolean = (position, liquidationPrice, fairPrice) => {
    return (
        (position === LONG &&
            liquidationPrice.gt(fairPrice) &&
            !isWithinRange(0.015, liquidationPrice.toNumber(), fairPrice.toNumber())) ||
        (position === SHORT &&
            liquidationPrice.lt(fairPrice) &&
            !isWithinRange(0.015, liquidationPrice.toNumber(), fairPrice.toNumber()))
    );
};

const checkErrors: (
    calculatorState: CalculatorState,
    result: PositionVars,
    maxLeverage: BigNumber,
    fairPrice: BigNumber,
    tokenBalance: BigNumber,
) => ErrorKey = (calculatorState, result, maxLeverage, fairPrice, tokenBalance) => {
    if (
        invalidLiquidationPrice(calculatorState.position, result.liquidationPrice, fairPrice) ||
        result.leverage.gte(maxLeverage)
    ) {
        return 'INVALID_POSITION';
    } else if (
        (calculatorState.position === LONG &&
            isWithinRange(0.015, result.liquidationPrice.toNumber(), fairPrice.toNumber())) ||
        (calculatorState.position === SHORT &&
            isWithinRange(0.015, result.liquidationPrice.toNumber(), fairPrice.toNumber()))
    ) {
        return 'DANGEROUS_POSITION';
    } else if (result.margin.gt(tokenBalance)) {
        return 'INSUFFICIENT_FUNDS';
    } else if (result.margin.gte(result.exposure.times(fairPrice))) {
        return 'OVER_COLLATERALISED';
    }
    return 'NO_ERROR';
};
