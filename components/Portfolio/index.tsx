import styled from 'styled-components';
import React from 'react';

export const LeftPanel = styled.div`
    width: 25%;
    margin-left: 5vw;
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
    width: 75%;
    margin-right: 5vw;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;

    @media only screen and (max-width: 1200px) {
        width: auto;
    }
`;

export const NoLeverageBanner = styled.div`
    width: 200px;
    padding: 10px;
    border-radius: 7px;
    color: #3da8f5;
    background-color: #002886;
`;

export const Button = styled.div`
    transition: 0.5s;
    color: #3da8f5;
    font-size: 1rem;
    line-height: 1rem;
    letter-spacing: -0.32px;
    border: 1px solid #3da8f5;
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
        background: #3da8f5;
        color: #fff;
    }

    &.primary:hover {
        background: #03065e;
        color: #3da8f5;
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
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    },
};

export const TableHead = styled.th`
    max-width: ${(props: any) => props.theme.maxWidth as string};
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
    border-bottom: 1px solid #002886;
`;

TableHead.defaultProps = {
    theme: {
        maxWidth: '150px',
    },
};

export const TableHeadEnd = styled.th`
    width: ${(props: any) => props.theme.width as string};
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
    border-bottom: 1px solid #002886;
`;

TableHeadEnd.defaultProps = {
    theme: {
        width: '200px',
    },
};

export const TableRow = styled.tr`
    display: ${(props: any) => props.theme.display as string};
    color: ${(props: any) => props.theme.color as string};
    opacity: ${(props: any) => props.theme.opacity as string};
    transition: 0.5s;

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
        hoverBG: '#002886',
        hoverCursor: 'pointer',
    },
};

export const TableCell = styled.td`
    color: ${(props: any) => props.color as string};
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-right: 1px solid #002886;
    border-bottom: 1px solid #002886;
`;

export const SecondaryCell = styled.div`
    color: #005ea4;
`;

export const DateAndTime = styled(({ className, date, time }) => {
    return (
        <div className={className}>
            {date}
            <div className="secondary">{time}</div>
        </div>
    );
})`
    font-size: 1rem;
    padding: 0.5rem 1rem;

    ${(props) => {
        if (props.borderTop === true) {
            return 'border-top: 1px solid #002886;';
        }
    }};

    ${(props) => {
        if (props.borderRight === true) {
            return 'border-right: 1px solid #002886;';
        }
    }};

    ${(props) => {
        if (props.borderBottom === true) {
            return 'border-bottom: 1px solid #002886;';
        }
    }};

    ${(props) => {
        if (props.borderLeft === true) {
            return 'border-left: 1px solid #002886;';
        }
    }};

    .secondary {
        color: ${(props) => props.color as string};
    }
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
