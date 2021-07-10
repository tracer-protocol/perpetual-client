import styled from 'styled-components';

export const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    border: 1px solid #0c3586;
`;

export const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    height: 87vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-bottom: 1px solid #0c3586;
`;

export const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
    color: var(--color-primary);
    font-size: ${(props: any) => props.theme.fontSize ? props.theme.fontSize as string : 'var(--font-size-small)' };
    line-height: 1rem;
    letter-spacing: -0.32px;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: ${(props: any) => props.theme.width as string};
    height: ${(props: any) => props.theme.height as string};

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

export const Table = styled.table``;

export const TableHeader = styled.thead``;

export const TableHeading = styled.th`
    text-align: left;
    color: var(--color-primary);
    height: 40px;
    font-size: var(--font-size-extra-small);
    padding-left: 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
`;

export const TableLastHeading = styled(TableHeading)`
    border-right: none;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    transition: 0.5s;
    color: white;
    opacity: 1;

    &:hover {
        background: var(--color-accent);
        cursor: pointer;
    }
`;

export const TableCell = styled.td`
    padding: 0 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
`;

// Last cell on a table row
export const TableLastCell = styled(TableCell)`
    border-right: none;
`;

export const SecondaryCell = styled.div`
    color: var(--color-secondary);
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
