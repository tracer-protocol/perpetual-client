import React, { MouseEventHandler } from 'react';
import { Children } from '@components/types';

type TBProps = {
    disabled?: boolean;
    onClick?: MouseEventHandler<Element>;
} & Children;

export const Button: React.FC<TBProps> = ({ disabled, onClick, children }: TBProps) => {
    return !disabled ? (
        <button className=" button transition-transform" type="button" onClick={onClick}>
            {children}
        </button>
    ) : (
        <button className="button-disabled transition-transform" type="button">
            {children}
        </button>
    );
};

export default Button;
