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

export const SmallTitle = styled.h2`
    font-size: var(--font-size-medium);
    letter-spacing: var(--letter-spacing-extra-small);
    color: var(--color-text);
    flex-basis: 100%;
    width: fit-content;
    white-space: nowrap;
`;

export const SecondaryCell = styled.div`
    color: var(--color-secondary);
    font-size: var(--font-size-small);
`;

export const StatusIndicator = styled.div<{
    color: string;
}>`
    color: ${(props) => props.color};
`;

export const calcStatus: (
    quote: number,
    availableMarginPercent: number,
) => {
    text: string;
    color: string;
} = (base, availableMarginPercent) => {
    if (availableMarginPercent === 0 || base === 0 || availableMarginPercent >= 1) {
        return {
            text: 'Closed',
            color: '#fff',
        };
    } else if (availableMarginPercent > 0.1) {
        return {
            text: 'Open',
            color: '#05CB3A',
        };
    } else if (availableMarginPercent > 0) {
        return {
            text: 'Approaching Liquidation',
            color: '#F4AB57',
        };
    } else {
        return {
            text: 'Eligible for Liquidation',
            color: '#F15025',
        };
    }
};
