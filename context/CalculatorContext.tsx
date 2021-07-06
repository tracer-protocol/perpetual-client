import React, { useReducer } from 'react';
import { Children } from 'types';
import { LONG, SHORT } from 'context/OrderContext';

export interface ContextProps {
    calculatorState: CalculatorState;
    calculatorDispatch: React.Dispatch<CalculatorAction>;
}

export const CalculatorContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

export const LOCK_EXPOSURE = 0;
export const LOCK_MARGIN = 1;
export const LOCK_LEVERAGE = 2;
export const LOCK_LIQUIDATION = 3;

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
    | { type: 'calculateFromExposureAndMargin'; exposure: number; margin: number }
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
    locked: [] 
};
export const CalculatorStore: React.FC<StoreProps> = ({ children }: StoreProps) => {
    const initialState: CalculatorState = {
        exposure: NaN,
        margin: NaN,
        leverage: 0,
        liquidationPrice: NaN,
        position: LONG,
        displayLocks: true,
        showResult: false,
        locked: [] 
    };

    const reducer = (state: CalculatorState, action: CalculatorAction) => {
        switch (action.type) {
            case 'calculateFromExposureAndMargin':
                return { ...state };
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
                let locked = state.locked;
                if (locked[0] === action.value || locked[1] === action.value) {
                    return { 
                        ...state,
                    }
                }
                if (locked.length <= 1) {
                    locked.push(action.value)
                } else {
                    locked[1] = action.value;
                }
                return {
                    ...state,
                    locked: locked,
                }
            case 'unlockValue': 
                return {
                    ...state,
                    locked: state.locked.filter((val) => val !== action.value)
                }
            case 'calculate': {
                return { ...state, showResult: true };
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
