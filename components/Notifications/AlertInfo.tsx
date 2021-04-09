import { ErrorVariant } from 'types/General';
import React from 'react';
interface PAlertInfo {
    variant: ErrorVariant;
    show: boolean;
    text: string;
}

const AlertInfo: React.FC<PAlertInfo> = ({ variant, show, text }: PAlertInfo) => {
    return (
        <div
            className={
                `w-full transition duration-500 p-2 m-2 box-shadow rounded border-2 text-center border-${variant}-200 bg-${variant}-100 ` +
                (!show ? 'invisible' : '')
            }
        >
            {text}
        </div>
    );
};

export default AlertInfo;
