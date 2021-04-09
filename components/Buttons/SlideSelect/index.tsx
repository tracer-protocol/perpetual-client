import React from 'react';
import { Children } from 'types';

type TSSProps = {
    onClick: (index: number, e: any) => any;
    value: number;
    bClasses?: string;
    sClasses?: string; // classes for selected items
    uClasses?: string; // classes for unselected items
    cClasses?: string; // container classes\
} & Children;

const SlideSelect: React.FC<TSSProps> = ({
    onClick,
    value,
    bClasses,
    children,
    sClasses,
    uClasses,
    cClasses,
}: TSSProps) => {
    return (
        <>
            <div className={cClasses}>
                {React.Children.toArray(children).map((child, index) => {
                    return (
                        <div
                            onClick={(e) => onClick(index, e)}
                            className={bClasses + `${index === value ? sClasses : uClasses}`}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

SlideSelect.defaultProps = {
    onClick: () => undefined,
    value: 0,
    cClasses: 'flex w-3/4 m-auto border-2 border-gray-100 rounded-full ',
    bClasses: 'flex w-1/2 h-12 cursor-pointer rounded-full transition duration-500 ',
    sClasses: 'border-2 border-blue-100 text-blue-100 bg-blue-300 shadow-lg shadow-gray-100 ',
    uClasses: 'border-gray-100 text-gray-100 ',
};

export * from './Options';
export default SlideSelect;
