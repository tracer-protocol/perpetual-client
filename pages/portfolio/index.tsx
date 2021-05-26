import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SubNav from '@components/Nav/SubNav';
import SideNav from '@components/Nav/SideNav';
import { Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';

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
        cursor: pointer;
        background: #3da8f5;
        color: #fff;
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
    },
};

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

const TableHead = styled.th`
    max-width: 150px;
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
`;

const TableHeadEnd = styled.th`
    width: 16rem;
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
`;

const TableCell = styled.td`
    color: ${(props: any) => props.color as string};
    font-size: 1rem;
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

const StatusIndicator = styled.div`
    color: ${(props: any) => props.color as string};
`;

const getStatusColour = (status: string) => {
    if (status == 'Eligible for Liquidation') {
        return '#F15025';
    } else if (status == 'Approaching Liquidation') {
        return '#F4AB57';
    }
    return '#fff';
};

const Position = () => {
    const [show, setShow] = useState(false);

    const largeWidth = {
        width: '250px',
    };

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

    const tracers = [
        {
            name: 'TSLA',
            market: 'TSLA-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: -4.5,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            status: 'Open',
        },
        {
            name: 'LINK',
            market: 'LINK-USDC',
            position: 'long',
            unrealisedPL: 453.23,
            realisedPL: 3.1,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            status: 'Eligible for Liquidation',
        },
        {
            name: 'ETH',
            market: 'ETH-USDC',
            position: 'short',
            unrealisedPL: -453.23,
            realisedPL: 4.5,
            marginUsed: 45.3,
            exposure: 4.5,
            liquidationP: 4500.3,
            status: 'Approaching Liquidation',
        },
    ];

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i == 7 ? <TableHeadEnd>{heading}</TableHeadEnd> : <TableHead>{heading}</TableHead>,
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tracers.map((tracer) => (
                        <TableRow>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div className="my-auto">
                                        <Logo ticker={tracer.name} />
                                    </div>
                                    <div className="my-auto ml-2">{tracer.market}</div>
                                </div>
                            </TableCell>
                            <TableCell>{tracer.position.toUpperCase()}</TableCell>
                            <TableCell color={tracer.unrealisedPL < 0 ? '#F15025' : '#21DD53'}>
                                {toApproxCurrency(tracer.unrealisedPL)}
                            </TableCell>
                            <TableCell color={tracer.realisedPL < 0 ? '#F15025' : '#21DD53'}>
                                {toApproxCurrency(tracer.realisedPL)}
                            </TableCell>
                            <TableCell>{toApproxCurrency(tracer.marginUsed)}</TableCell>
                            <TableCell>
                                {tracer.exposure} {tracer.name}
                            </TableCell>
                            <TableCell>{tracer.liquidationP}</TableCell>
                            <TableCell>
                                <div className="flex flex-row">
                                    <StatusIndicator
                                        color={getStatusColour(tracer.status)}
                                        className="font-black my-auto"
                                    >
                                        &bull;
                                    </StatusIndicator>
                                    <div className="mx-2 my-auto">{tracer.status}</div>
                                    <div className="my-auto ml-auto">
                                        <Button>Close</Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </table>
            <div className="flex mt-8 justify-center">
                <Button theme={largeWidth}>{show ? 'Hide Closed Position' : 'Show Closed Position'}</Button>
            </div>
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
