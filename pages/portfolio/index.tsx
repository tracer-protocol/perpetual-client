import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SubNav from '@components/Nav/SubNav';
import SideNav from '@components/Nav/SideNav';
import { Logo } from '@components/General';

const LeftPanel = styled.div`
    width: 25%;
    margin-left: 5vw;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-left: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    margin-right: 5vw;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
`;

const TableHeadStart = styled.th`
    width: 6rem;
    font-size: 0.8rem;
    text-align: left;
    color: #3da8f5;
    padding: 0.5rem 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
`;

const TableHeadMiddle = styled.th`
    width: 5rem;
    font-size: 0.8rem;
    text-align: left;
    color: #3da8f5;
    padding: 0.5rem 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
`;

const TableHeadEnd = styled.th`
    width: 10vw;
    font-size: 0.8rem;
    text-align: left;
    color: #3da8f5;
    padding: 0.5rem 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
`;

const TableCell = styled.td`
    padding: 0.5rem 1rem;
    border: 1px solid #002886;
`;

const TableRow = styled.tr`
    transition: 0.5s;
    &:hover {
        background: #002886;
        cursor: pointer;
    }
`;

const Position = () => {
    const headings = [
        'Market',
        'Position',
        'Unrealised P&L',
        'Realised P&L',
        'Margin Used',
        'Exposure',
        'Liquidation Price / Mark Price',
        'Status',
    ];

    const tracers = [
        {
            market: 'TSLA-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: -4.5,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            status: 'Open',
        },
    ];

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i == 0 ? (
                                <TableHeadStart>{heading}</TableHeadStart>
                            ) : i == 7 ? (
                                <TableHeadEnd>{heading}</TableHeadEnd>
                            ) : (
                                <TableHeadMiddle>{heading}</TableHeadMiddle>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer) => (
                        <TableRow>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker="TSLA" />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.position.toUpperCase()}</TableCell>
                            <TableCell>{tracer.unrealisedPL}</TableCell>
                            <TableCell>{tracer.realisedPL}</TableCell>
                            <TableCell>{tracer.marginUsed}</TableCell>
                            <TableCell>{tracer.exposure}</TableCell>
                            <TableCell>{tracer.liquidationP}</TableCell>
                            <TableCell>{tracer.status}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

const TradingPortfolio = () => {
    const [tab, setTab] = useState(0);
    const tabs = ['Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <>
                        <Position />
                    </>
                );
            case 1:
                return <>Margin Accounts Tab</>;
            case 2:
                return <>Trade History Tab</>;
            case 3:
                return <>Transfers Tab</>;
            default:
                return;
        }
    };
    return (
        <>
            <SubNav tabs={tabs} setTab={setTab} selected={tab} />
            {content()}
        </>
    );
};

const Portfolio: React.FC = styled(({ className }) => {
    const [tab, setTab] = useState(0);
    const tabs = ['Trading Portfolio', 'Insurance Portfolio'];
    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <>
                        <TradingPortfolio />
                    </>
                );
            case 1:
                return <>Insurance Portfolio</>;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <NavBar />
            <div className="flex h-full">
                <LeftPanel>
                    <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                </LeftPanel>
                <RightPanel>{content()}</RightPanel>
            </div>
        </div>
    );
})`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #03065e;
    color: #fff;
`;

export default Portfolio;
