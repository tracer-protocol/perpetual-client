import React from 'react';
import styled from 'styled-components';
import TooltipSelector, { TooltipSelectorProps } from '@components/Tooltips/TooltipSelector';

type DProps = {
    text: string;
    tooltip: TooltipSelectorProps;
    className?: string;
};

const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    opacity: 0.5;
    color: var(--color-primary);
    &:not(:empty)::before {
        margin-right: 0.25em;
    }

    &:not(:empty)::after {
        margin-left: 0.25em;
    }
    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--color-primary);
    }
`;
export default styled(({ text, tooltip, className }: DProps) => (
    <div className={className}>
        {tooltip ? (
            <TooltipSelector tooltip={tooltip}>
                <Divider>{text}</Divider>
            </TooltipSelector>
        ) : (
            <Divider>{text}</Divider>
        )}
    </div>
))`
    margin: 1rem 0;
` as React.FC<DProps>;
