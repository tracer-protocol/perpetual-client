import styled from 'styled-components';

export const TradingTable = styled.table`
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    font-size: 16px;
    margin-top: 10px;

    thead tr th {
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #FFFFFF;
        text-transform: capitalize;
        text-align: left;
        font-weight: normal;
        padding-bottom: 5px;
    }

    > * tr.ask:last-of-type,
    > * tr.bid:first-of-type {
        font-weight: bold;
    }
`