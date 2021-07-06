import React, { useReducer } from 'react';
import { Children } from 'types';
import { LONG, SHORT } from 'context/OrderContext';

export interface ContextProps {
    calculatorState: CalculatorState;
    calculatorDispatch: React.Dispatch<CalculatorAction>;
}

export const CalculatorContext = React.createContext<Partial<ContextProps>>({} as ContextProps);

type CalculatorState = {
    exposure: number;
    margin: number;
    liquidationPrice: number;
    leverage: number;
    position: typeof LONG | typeof SHORT;
};

type CalculatorAction =
    | { type: 'calculateFromExposureAndMargin'; exposure: number; margin: number }
    | { type: 'setExposure'; value: number }
    | { type: 'setLiquidationPrice'; value: number }
    | { type: 'setLeverage'; value: number }
    | { type: 'setMargin'; value: number }
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
};
export const CalculatorStore: React.FC<StoreProps> = ({ children }: StoreProps) => {
    const initialState: CalculatorState = defaultState;

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
            case 'calculate': {
                return { ...state };
            }
            case 'reset': {
                return { ...defaultState };
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
