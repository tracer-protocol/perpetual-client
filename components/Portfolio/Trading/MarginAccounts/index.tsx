import React, { useState } from 'react';
import { Button, Logo } from '@components/General';
import { toApproxCurrency, toPercent } from '@libs/utils';
import {
    TableHeading,
    TableRow,
    TableCell,
    TableLastHeading,
    TableLastCell,
    Table,
    TableBody,
    TableHeader,
} from '@components/General/Table';
import { StatusIndicator, calcStatus } from '@components/Portfolio';
import Tracer, { defaults } from '@libs/Tracer';
import AccountModal from '@components/General/TracerModal/AccountModal';
import { UserBalance } from '@libs/types';
import BigNumber from 'bignumber.js';

// const NoLeverageTip = <p>You have no leveraged trades open in this market.</p>;

const MarginAccounts: React.FC<{
    tracers: Tracer[];
}> = ({ tracers }) => {
    const [popup, setPopup] = useState(false);
    const [deposit, setDeposit] = useState(false);
    const [unit, setUnit] = useState('NO_ID');
    const [balances, setBalances] = useState(defaults.balances);
    const [maxLeverage, setMaxLeverage] = useState(defaults.maxLeverage);
    const [fairPrice, setFairPrice] = useState(defaults.fairPrice);

    const handleClick = (
        popup: boolean,
        deposit: boolean,
        unit: string,
        balances: UserBalance,
        maxLeverage: BigNumber,
        fairPrice: BigNumber,
    ) => {
        setPopup(popup);
        setDeposit(deposit);
        setUnit(unit);
        setBalances(balances);
        setMaxLeverage(maxLeverage);
        setFairPrice(fairPrice);
    };

    const headings = ['Market', 'Equity', 'Maintenance Margin', 'Available Margin', 'Status of Position'];

    return (
        <>
            <Table>
                <TableHeader>
                    <tr>
                        {headings.map((heading, i) =>
                            i !== 4 ? (
                                <TableHeading>{heading}</TableHeading>
                            ) : (
                                <TableLastHeading>{heading}</TableLastHeading>
                            ),
                        )}
                    </tr>
                </TableHeader>
                <TableBody>
                    {tracers.map((tracer, i) => {
                        const balances = tracer.getBalance();
                        const status = calcStatus(balances.base.toNumber(), balances.availableMarginPercent.toNumber());
                        return (
                            <TableRow key={`table-row-${i}`}>
                                <TableCell>
                                    {/*<Tooltip title={NoLeverageTip}>*/}
                                    <div className="flex flex-row">
                                        <div className="my-auto">
                                            <Logo ticker={tracer.baseTicker} />
                                        </div>
                                        <div className="my-auto ml-2">{tracer.marketId}</div>
                                    </div>
                                    {/*</Tooltip>*/}
                                </TableCell>
                                <TableCell>{toApproxCurrency(balances.totalMargin)}</TableCell>
                                <TableCell>{toApproxCurrency(balances.minimumMargin)}</TableCell>
                                <TableCell>{toPercent(balances.availableMarginPercent.toNumber(), true)}</TableCell>
                                <TableLastCell>
                                    <div className="flex flex-row">
                                        <StatusIndicator color={status.color} className="text-2xl my-auto">
                                            &bull;
                                        </StatusIndicator>
                                        <div className="mx-2 my-auto">{status.text}</div>
                                        <div className="flex flex-row my-auto ml-auto mr-4">
                                            <Button
                                                className="mr-2"
                                                onClick={(_e: any) =>
                                                    handleClick(
                                                        true,
                                                        true,
                                                        tracer.marketId?.split('/')[1],
                                                        tracer.getBalance(),
                                                        tracer.getMaxLeverage(),
                                                        tracer.getFairPrice(),
                                                    )
                                                }
                                            >
                                                Deposit
                                            </Button>
                                            <Button
                                                onClick={(_e: any) =>
                                                    handleClick(
                                                        true,
                                                        false,
                                                        tracer.marketId?.split('/')[1],
                                                        tracer.getBalance(),
                                                        tracer.getMaxLeverage(),
                                                        tracer.getFairPrice(),
                                                    )
                                                }
                                            >
                                                Withdraw
                                            </Button>
                                        </div>
                                    </div>
                                </TableLastCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <AccountModal
                display={popup}
                close={() => setPopup(false)}
                isDeposit={deposit}
                setDeposit={setDeposit}
                unit={unit}
                balances={balances}
                maxLeverage={maxLeverage}
                fairPrice={fairPrice}
            />
        </>
    );
};

export default MarginAccounts;
