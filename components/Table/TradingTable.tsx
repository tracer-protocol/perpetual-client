import styled from 'styled-components';

export const TradingTable = styled.table`
    border-collapse: collapse;
    table-layout: fixed;
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-size: var(--font-size-small);

    thead tr th {
        font-size: var(--font-size-small);
        letter-spacing: var(--letter-spacing-small);
        color: #ffffff;
        text-transform: capitalize;
        text-align: left;
        font-weight: normal;
        padding-bottom: 5px;
    }

    thead,
    tbody tr {
        display: table;
        width: 100%;
        line-height: 15px;
        table-layout: fixed; /* even columns width , fix width of table too*/
    }

    tbody {
        display: block;
        height: 100%;
        max-height: 25vh;
        overflow-y: scroll;
    }

    > * tr.ask:last-of-type,
    > * tr.bid:first-of-type {
        font-weight: bold;
    }
`;
