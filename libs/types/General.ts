import React from 'react';

export type Children = {
    children?: React.ReactNode;
};

export type Result = {
    status: 'error' | 'success';
    message?: string;
    error?: string;
};

export type ErrorVariant = 'NONE' | 'warning' | 'error';
