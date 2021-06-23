import { default as AntMenu } from 'antd/lib/menu';
import styled from 'styled-components';

export const Menu = styled(AntMenu)`
    background: var(--color-background-secondary);
`;
export const MenuItem = styled(AntMenu.Item)`
    color: var(--color-text);
    border-top: 1px solid var(--color-accent);
    &:last-child {
        border-bottom: 1px solid var(--color-accent);
    }

    &:hover {
        background: var(--color-primary);
    }
`;
