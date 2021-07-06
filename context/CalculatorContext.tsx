import React, { useContext, useReducer } from 'react';
import { Children } from 'types';
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
import { PositionVars } from '../../tracer-utils/dist/Types/calculator';
export interface ContextProps {
    calculatorState: CalculatorState;
    calculatorDispatch: React.Dispatch<CalculatorAction>;
}

export const CalculatorContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

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
};

export type CalculatorAction =
    | { type: 'setExposure'; value: number }
    | { type: 'setLiquidationPrice'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setMargin'; value: number }
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
    };

    const reducer = (state: CalculatorState, action: CalculatorAction) => {
        switch (action.type) {
            case 'setExposure':
                return { ...state, exposure: action.value };
            case 'setMargin':
                return { ...state, margin: action.value };
            case 'setLiquidationPrice':
                return { ...state, liquidationPrice: action.value };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setPosition':
                return {
                    ...state,
                    position: (state.position === LONG ? SHORT : LONG) as typeof LONG | typeof SHORT,
                };
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
