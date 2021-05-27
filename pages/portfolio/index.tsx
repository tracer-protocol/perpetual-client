import React, { useState, useContext } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SubNav from '@components/Nav/SubNav';
import SideNav from '@components/Nav/SideNav';
import { Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import { FactoryContext } from '@context/FactoryContext';
import Tracer from '@libs/Tracer';
import { calcLiquidationPrice, calcTotalMargin } from '@tracer-protocol/tracer-utils';

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

const NoLeverageBanner = styled.div`
    width: 200px;
    padding: 10px;
    border-radius: 7px;
    color: #3da8f5;
    background-color: #002886;
`;

const Button = styled.div`
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

const TableHead = styled.th`
    max-width: ${(props: any) => props.theme.maxWidth as string};
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
`;

TableHead.defaultProps = {
    theme: {
        maxWidth: '150px',
    },
};

const TableHeadEnd = styled.th`
    width: ${(props: any) => props.theme.width as string};
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
`;

TableHeadEnd.defaultProps = {
    theme: {
        width: '200px',
    },
};

const TableRow = styled.tr`
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

const TableCell = styled.td`
    color: ${(props: any) => props.color as string};
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: 1px solid #002886;
`;

const SecondaryCell = styled.div`
    color: #005ea4;
`;

const StatusIndicator = styled.div`
    color: ${(props: any) => props.color as string};
`;

const getStatusColour = (status: string) => {
    if (status === 'Eligible for Liquidation') {
        return '#F15025';
    } else if (status === 'Approaching Liquidation') {
        return '#F4AB57';
    }
    return '#fff';
};

const Position:React.FC<{ labelledTracers: Record<string, Tracer> }> = ({ labelledTracers }) => {
    const [show, setShow] = useState(false);

    const headings = [
        'Market',
        'Position',
        'Unrealised P&L',
        'Realised P&L',
        'Margin Used',
        'Exposure',
        'Liquidation Price/ Mark Price',
        'Status',
    ];

    const _status = [
        "Open", "Eligible for Liquidation", "Approaching Liquidation", "Closed"
    ]
    // const tracers = [
    //     {
    //         name: 'TSLA',
    //         market: 'TSLA-USDC',
    //         position: 'long',
    //         unrealisedPL: 453.23,
    //         realisedPL: -4.5,
    //         marginUsed: 45.3,
    //         exposure: 4.5,
    //         liquidationP: 4500.3,
    //         markP: 4255.2,
    //         status: 'Open',
    //     },
    //     {
    //         name: 'LINK',
    //         market: 'LINK-USDC',
    //         position: 'long',
    //         unrealisedPL: 453.23,
    //         realisedPL: 3.1,
    //         marginUsed: 45.3,
    //         exposure: 4.5,
    //         liquidationP: 4500.3,
    //         markP: 4255.2,
    //         status: 'Eligible for Liquidation',
    //     },
    //     {
    //         name: 'ETH',
    //         market: 'ETH-USDC',
    //         position: 'short',
    //         unrealisedPL: -453.23,
    //         realisedPL: 4.5,
    //         marginUsed: 45.3,
    //         exposure: 4.5,
    //         liquidationP: 4500.3,
    //         markP: 4255.2,
    //         status: 'Approaching Liquidation',
    //     },
    //     {
    //         name: 'TSLA',
    //         market: 'TSLA-USDC',
    //         position: 'long',
    //         unrealisedPL: 453.23,
    //         realisedPL: -4.5,
    //         marginUsed: 45.3,
    //         exposure: 4.5,
    //         liquidationP: 4500.3,
    //         markP: 4255.2,
    //         status: 'Closed',
    //     },
    //     {
    //         name: 'LINK',
    //         market: 'LINK-USDC',
    //         position: 'long',
    //         unrealisedPL: 453.23,
    //         realisedPL: 3.1,
    //         marginUsed: 45.3,
    //         exposure: 4.5,
    //         liquidationP: 4500.3,
    //         markP: 4255.2,
    //         status: 'Closed',
    //     },
    // ];

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
    };

    const activeButton = {
        width: '100px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    const inactiveButton = {
        width: '100px',
    };

    const largeButton = {
        width: '250px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    const openRow = {
        display: 'normal',
        color: '#fff',
        opacity: 1,
        hoverBG: '#002886',
        hoverCursor: 'pointer',
    };

    const showClosedRow = {
        display: 'normal',
        color: '##00000029',
        opacity: 0.5,
    };

    const hideClosedRow = {
        display: 'none',
    };

    const getRowStatus = (status: string, show: boolean) => {
        if (status !== 'Closed') {
            return openRow;
        } else {
            if (show) {
                return showClosedRow;
            } else {
                return hideClosedRow;
            }
        }
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 7 ? <TableHeadEnd>{heading}</TableHeadEnd> : <TableHead>{heading}</TableHead>,
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Object.values(labelledTracers).map((tracer, i) => { 
                        let name = tracer.marketId.split("/")[0];
                        let status = _status[i];
                        let { quote, base } = tracer.balances;

                        // TODO calculate these
                        let unrealisedPL= 453.23, realisedPL = -4.5;

                        return (
                            <TableRow key={`table-row-${i}`} theme={getRowStatus(status[i], show)}>
                                <TableCell>
                                    <div className="flex flex-row">
                                        <div className="my-auto">
                                            <Logo ticker={name} />
                                        </div>
                                        <div className="my-auto ml-2">{tracer.marketId}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{base.lt(0) ? 'SHORT' : 'LONG'}</TableCell>
                                <TableCell color={unrealisedPL < 0 ? '#F15025' : '#21DD53'}>
                                    {toApproxCurrency(unrealisedPL)}
                                </TableCell>
                                <TableCell color={realisedPL < 0 ? '#F15025' : '#21DD53'}>
                                    {toApproxCurrency(realisedPL)}
                                </TableCell>
                                <TableCell>{toApproxCurrency(calcTotalMargin(quote, base, tracer.oraclePrice))}</TableCell>
                                <TableCell>
                                    {base.abs().toNumber()} {name}
                                </TableCell>
                                <TableCell>
                                    {toApproxCurrency(calcLiquidationPrice(quote, base, tracer.oraclePrice, tracer.maxLeverage))}
                                    <SecondaryCell>{toApproxCurrency(tracer.oraclePrice)}</SecondaryCell>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-row">
                                        <StatusIndicator
                                            color={getStatusColour(status)}
                                            className="text-2xl my-auto"
                                        >
                                            &bull;
                                        </StatusIndicator>
                                        <div className="mx-2 my-auto">{status}</div>
                                        <div className="my-auto ml-auto">
                                            <Button theme={status !== 'Closed' ? activeButton : inactiveButton}>
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    )}
                </tbody>
            </table>
            <div className="flex mt-8 justify-center">
                <Button theme={largeButton} onClick={(e) => onClick(e)}>
                    {show ? 'Hide Closed Positions' : 'Show Closed Positions'}
                </Button>
            </div>
        </>
    );
};

const MarginAccounts = () => {
    const headings = ['Market', 'Total Margin', 'Maintenance Margin', 'Available Margin', 'Status of Position'];

    const tracers = [
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            tMargin: 4242,
            mMargin: 2121,
            aMargin: 2121,
            status: 'Open',
        },
        {
            name: 'LINK',
            market: 'LINK-USDC',
            tMargin: 4242,
            mMargin: 2121,
            aMargin: 2121,
            status: 'Eligible for Liquidation',
        },
        {
            name: 'ETH',
            market: 'ETH-USDC',
            tMargin: 4242,
            mMargin: 2121,
            aMargin: 2121,
            status: 'Approaching Liquidation',
        },
    ];

    const tableHeadEnd = {
        width: '500px',
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 4 ? (
                                <TableHeadEnd theme={tableHeadEnd}>{heading}</TableHeadEnd>
                            ) : (
                                <TableHead>{heading}</TableHead>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{toApproxCurrency(tracer.tMargin)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.mMargin)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.aMargin)}</TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <StatusIndicator
                                        color={getStatusColour(tracer.status)}
                                        className="text-2xl my-auto"
                                    >
                                        &bull;
                                    </StatusIndicator>
                                    <div className="mx-2 my-auto">{tracer.status}</div>
                                    <div className="flex flex-row my-auto ml-auto mr-4">
                                        <Button className="mr-2">Deposit</Button>
                                        <Button>Withdraw</Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
            <NoLeverageBanner className="ml-72 mt-2">
                You have no leveraged trades open in this market.
            </NoLeverageBanner>
        </>
    );
};

const TradeHistory = () => {
    const headings = ['Date', 'Market', 'Position', 'Exposure / Price', 'Slippage', 'Fees', 'Total Cost', 'Order Type'];

    const tracers = [
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            exposure: 4.5,
            slippage: 3.23,
            fees: 2.23,
            cost: 453.23,
            type: 'Market',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            exposure: 4.5,
            slippage: 3.23,
            fees: 2.23,
            cost: 453.23,
            type: 'Market',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            exposure: 4.5,
            slippage: 3.23,
            fees: 2.23,
            cost: 453.23,
            type: 'Market',
        },
    ];

    const tableHeadEnd = {
        width: '200px',
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 7 ? (
                                <TableHeadEnd theme={tableHeadEnd}>{heading}</TableHeadEnd>
                            ) : (
                                <TableHead>{heading}</TableHead>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                {tracer.date}
                                <SecondaryCell>{tracer.time}</SecondaryCell>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.position.toUpperCase()}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.exposure)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.slippage)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.fees)}</TableCell>
                            <TableCell>{toApproxCurrency(tracer.cost)}</TableCell>
                            <TableCell>{tracer.type}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

const Transfers = () => {
    const headings = ['Date', 'Type', 'Amount / Currency', 'Transaction Details'];

    const tracers = [
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            type: 'Deposit',
            amount: 4562,
            currency: 'DAI',
            details: '0x75...423',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            type: 'Deposit',
            amount: 4562,
            currency: 'DAI',
            details: '0x75...423',
        },
        {
            date: '24/04/2021',
            time: '04:31pm',
            name: 'TSLA',
            type: 'Deposit',
            amount: 4562,
            currency: 'DAI',
            details: '0x75...423',
        },
    ];

    const tableHeadEnd = {
        width: '700px',
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 3 ? (
                                <TableHeadEnd theme={tableHeadEnd}>{heading}</TableHeadEnd>
                            ) : (
                                <TableHead>{heading}</TableHead>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer, i) => (
                        <TableRow key={`table-row-${i}`}>
                            <TableCell>
                                {tracer.date}
                                <SecondaryCell>{tracer.time}</SecondaryCell>
                            </TableCell>
                            <TableCell>{tracer.type}</TableCell>
                            <TableCell>
                                {toApproxCurrency(tracer.amount)}
                                <SecondaryCell>{tracer.currency}</SecondaryCell>
                            </TableCell>
                            <TableCell>{tracer.details}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
        </>
    );
};

const TradingPortfolio = () => {
    const { tracers } = useContext(FactoryContext);
    const [tab, setTab] = useState(0);
    const tabs = ['Positions', 'Margin Accounts', 'Trade History', 'Transfers'];
    const content = () => {
        switch (tab) {
            case 0:
                return <Position labelledTracers={tracers ?? {}} />;
            case 1:
                return <MarginAccounts />;
            case 2:
                return <TradeHistory />;
            case 3:
                return <Transfers />;
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
