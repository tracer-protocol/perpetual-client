import React from 'react';
import { Children } from 'types';

export const MatchingEngine: React.FC<{ title: string; subTitle: string }> = ({
    title,
    subTitle,
}) => (
    <div className="m-auto text-center">
        <a>
            <strong>{title}</strong>
        </a>
        <br></br>
        <a>{subTitle}</a>
    </div>
);

export const Option: React.FC<
    {
        className?: string;
    } & Children
> = ({ children, className }) => (
    <a className={`m-auto ${className}`}>{children}</a>
);
