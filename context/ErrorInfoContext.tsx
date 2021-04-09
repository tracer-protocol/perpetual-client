import React, { useState, useEffect } from 'react';
import { Children } from 'types';
import { ErrorVariant } from 'types/General';

interface ContextProps {
    text: string;
    variant: ErrorVariant;
    show: boolean;
    setError: (id: number, setterId: number) => void;
}

export const ErrorContext = React.createContext<ContextProps>({
    text: '',
    variant: 'NONE',
    show: false,
    setError: (_id, _setterId) => console.log('Error function not set'),
});

/*
    MAPPING OF ERROR ID's, ADJUST IN THE SWITCH STATEMENT

    0 -> hide the error box
    1 -> margin entered is higher then margin in account
    2 - > all orders are being filled
*/
export const ErrorInfo: React.FC<Children> = ({ children }: Children) => {
    const [text, setText] = useState('');
    const [variant, setVariant] = useState<ErrorVariant>('NONE');
    const [show, setShow] = useState(false);

    const [error, setErrorState] = useState<number>(0);

    const setError = (id: number, setterId: number) => {
        if (!id) {
            // if they are setting the number to 0
            if (setterId === error) {
                setErrorState(0);
            }
        } else {
            if (!error) {
                // if its 0 then nothing will have heigher preference so just set it
                setErrorState(id);
            } else if (id < error) {
                // if it has higher preference
                setErrorState(id);
            }
        }
    };

    useEffect(() => {
        switch (error) {
            case 1:
                setText('Not enough margin in account.');
                setVariant('error');
                setShow(true);
                break;
            case 2:
                setText('This order takes all available orders.');
                setVariant('warning');
                setShow(true);
                break;
            case 0:
            default:
                setShow(false);
                break;
        }
    }, [error]);

    return <ErrorContext.Provider value={{ show, text, variant, setError }}>{children}</ErrorContext.Provider>;
};
