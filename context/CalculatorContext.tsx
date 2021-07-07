import React, { useContext, useEffect, useReducer } from 'react';
import { Children } from 'libs/types';
import { LONG, SHORT } from 'context/OrderContext';
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
    showResult: boolean;
    locked: number[]; // functions like a stack
    error: ErrorKey;
};

export type CalculatorAction =
    | { type: 'setExposure'; value: number }
    | { type: 'setLiquidationPrice'; value: number }
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
    leverage: 0,
    liquidationPrice: NaN,
    position: LONG,
    displayLocks: true,
    showResult: false,
    locked: [],
    error: 'NO_ERROR',
};
export const CalculatorStore: React.FC<StoreProps> = ({ children }: StoreProps) => {
    const { selectedTracer } = useContext(TracerContext);

    const initialState: CalculatorState = {
        exposure: NaN,
        margin: NaN,
        leverage: 0,
        liquidationPrice: NaN,
        position: LONG,
        displayLocks: true,
        showResult: false,
        locked: [],
        error: 'NO_ERROR',
    };

    const reducer = (state: CalculatorState, action: CalculatorAction) => {
        switch (action.type) {
            case 'setExposure':
                return { ...state, showResult: false, exposure: action.value };
            case 'setMargin':
                return { ...state, showResult: false, margin: action.value };
            case 'setLiquidationPrice':
                return { ...state, showResult: false, liquidationPrice: action.value };
            case 'setLeverage':
                return { ...state, showResult: false, leverage: action.value };
            case 'setPosition':
                return {
                    ...state,
                    showResult: false,
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
                    locked[1] = action.value;
                }
                return {
                    ...state,
                    locked: locked,
                };
            case 'unlockValue':
                return {
                    ...state,
                    locked: state.locked.filter((val) => val !== action.value),
                };
            case 'calculate': {
                if (state.locked.length < 2) {
                    return {
                        ...state,
                        error: 'INVALID_INPUTS',
                    };
                } else if (isLockedAndFalsey(state.locked, state.exposure, state.margin, state.liquidationPrice)) {
                    return {
                        ...state,
                        error: 'ZEROED_INPUTS'
                    }
                }
                const result = getResult(
                    state,
                    selectedTracer?.getFairPrice() ?? defaults.fairPrice,
                    selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage,
                );
                return {
                    ...state,
                    showResult: true,
                    exposure: parseFloat(result.exposure.toFixed(5)),
                    liquidationPrice: parseFloat(result.liquidationPrice.toFixed(5)),
                    leverage: parseFloat(result.leverage.toFixed(1)),
                    margin: parseFloat(result.margin.toFixed(5)),
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

    useEffect(() => {
        if (calculatorState.showResult) {
            const error = checkErrors(
                calculatorState,
                selectedTracer?.getMaxLeverage() ?? defaults.maxLeverage,
                selectedTracer?.getFairPrice() ?? defaults.fairPrice,
                selectedTracer?.getBalance().tokenBalance ?? defaults.balances.tokenBalance,
            );
            if (error !== calculatorState.error) {
                calculatorDispatch({ type: 'setError', value: error });
            }
        } else {
            calculatorDispatch({ type: 'setError', value: 'NO_ERROR' });
        }
    }, [calculatorState.showResult]);

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
    for (let lockedKey of locked) {
        if (lockedKey === LOCK_EXPOSURE && !exposure) return true;
        if (lockedKey === LOCK_MARGIN && !margin) return true;
        if (lockedKey === LOCK_LIQUIDATION && !liquidationPrice) return true;
    } // else  
    return false;
}

const checkErrors: (
    calculatorState: CalculatorState,
    maxLeverage: BigNumber,
    fairPrice: BigNumber,
    tokenBalance: BigNumber,
) => ErrorKey = (calculatorState, maxLeverage, fairPrice, tokenBalance) => {
    if (
        (calculatorState.position === LONG && calculatorState.liquidationPrice >= fairPrice.toNumber()) ||
        (calculatorState.position === SHORT && calculatorState.liquidationPrice <= fairPrice.toNumber()) ||
        calculatorState.leverage >= maxLeverage.toNumber()
    ) {
        return 'INVALID_POSITION';
    } else if (calculatorState.margin > tokenBalance.toNumber()) {
        return 'INSUFFICIENT_FUNDS';
    } else if (calculatorState.margin >= calculatorState.exposure * fairPrice.toNumber()) {
        return 'OVER_COLLATERALISED';
    }
    return 'NO_ERROR';
};
