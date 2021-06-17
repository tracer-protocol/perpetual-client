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
        color: #ffffff;
        text-transform: capitalize;
        text-align: left;
        font-weight: normal;
        padding-bottom: 5px;
    }
    thead tr th:first-child {
        width: 40%;
    }
    thead tr th:last-child {
        width: 30%;
    }


    > * tr.ask:last-of-type,
    > * tr.bid:first-of-type {
        font-weight: bold;
    }
`;
