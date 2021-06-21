import styled from 'styled-components';

export const TradingTable = styled.table`
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    font-size: 1rem;
    margin-top: 1vh;

    thead tr th {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #ffffff;
        text-transform: capitalize;
        text-align: left;
        font-weight: normal;
        padding-bottom: 5px;
    }

    thead, tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;/* even columns width , fix width of table too*/
    }

    tbody {
        display: block;
        height: 24vh;
        overflow-y: scroll;
    }

    > * tr.ask:last-of-type,
    > * tr.bid:first-of-type {
        font-weight: bold;
    }
`;
