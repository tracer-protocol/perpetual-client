import styled from 'styled-components';

export const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-left: 1px solid #0c3586;

    @media only screen and (max-width: 1200px) {
        width: auto;
    }
`;

export const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;

    @media only screen and (max-width: 1200px) {
        width: auto;
    }
`;

export const Button = styled.div`
    transition: 0.5s;
    color: var(--color-primary);
    font-size: var(--font-size-small);
    line-height: 1rem;
    letter-spacing: -0.32px;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: ${(props: any) => props.theme.width as string};

    &:hover {
        color: ${(props: any) => props.theme.hoverFG as string};
        background: ${(props: any) => props.theme.hoverBG as string};
        cursor: ${(props: any) => props.theme.hoverCursor as string};
    }

    &.primary {
        background: var(--color-primary);
        color: var(--color-text);
    }

    &.primary:hover {
        background: var(--color-background);
        color: var(--color-primary);
    }

    &.disabled {
        opacity: 0.8;
    }

    &.disabled:hover {
        cursor: not-allowed;
    }
`;

Button.defaultProps = {
    theme: {
        width: '100px',
        hoverFG: '#fff',
        hoverBG: 'var(--color-primary)',
        hoverCursor: 'pointer',
    },
};

export const TableHead = styled.th`
    text-align: left;
    color: var(--color-primary);
    max-width: ${(props: any) => props.theme.maxWidth as string};
    min-width: ${(props: any) => props.theme.minWidth as string};
    width: ${(props: any) => props.theme.width};
    height: ${(props: any) => props.theme.height as string};
    padding: ${(props: any) => props.theme.padding as string};
    font-weight: normal;
    border-right: ${(props: any) => props.theme.borderRight as string};
    border-bottom: ${(props: any) => props.theme.borderBottom as string};
`;

TableHead.defaultProps = {
    theme: {
        maxWidth: '300px',
        minWidth: '140px',
        width: 'auto',
        height: '50px',
        padding: '0 1rem',
        borderRight: '1px solid var(--color-accent)',
        borderBottom: '1px solid var(--color-accent)',
    },
};

export const TableRow = styled.tr`
    transition: 0.5s;
    height: ${(props: any) => props.theme.height as string};
    display: ${(props: any) => props.theme.display as string};
    color: ${(props: any) => props.theme.color as string};
    opacity: ${(props: any) => props.theme.opacity as string};

    &:hover {
        background: ${(props: any) => props.theme.hoverBG as string};
        cursor: ${(props: any) => props.theme.hoverCursor as string};
    }
`;

TableRow.defaultProps = {
    theme: {
        display: 'normal',
        color: '#fff',
        opacity: 1,
        hoverBG: 'var(--color-accent)',
        hoverCursor: 'pointer',
    },
};

export const TableCell = styled.td`
    color: ${(props: any) => props.color as string};
    padding: ${(props: any) => props.theme.padding as string};
    height: ${(props: any) => props.theme.height as string};
    border-right: ${(props: any) => props.theme.borderRight as string};
    border-bottom: ${(props: any) => props.theme.borderBottom as string};
`;

TableCell.defaultProps = {
    theme: {
        padding: '0 1rem',
        borderRight: '1px solid var(--color-accent)',
        borderBottom: '1px solid var(--color-accent)',
    },
};

export const SecondaryCell = styled.div`
    color: #005ea4;
    font-size: var(--font-size-small);
`;

export const StatusIndicator = styled.div`
    color: ${(props: any) => props.color as string};
`;

export function getStatusColour(status: string): string {
    let colour = '#fff';
    if (status === 'Eligible for Liquidation') {
        colour = '#F15025';
    } else if (status === 'Approaching Liquidation') {
        colour = '#F4AB57';
    }
    return colour;
}
