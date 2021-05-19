import React, { useContext, useState } from 'react';
import { TracerContext } from 'context';
import { Tracer } from 'libs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Table, { TableRow } from '@components/Tables';
import TracerModal from '@components/Modals';

import Link from 'next/link';
import { toApproxCurrency } from '@libs/utils';
import { calcTotalMargin, calcLiquidationPrice } from '@tracer-protocol/tracer-utils';

/** ALll subject to change */
const PositionClose: () => any = () => {
    const { selectedTracer, tracerId } = useContext(TracerContext);
    const balances = selectedTracer?.balances ?? { base: 0 };

    const close = async () => null;

    return (
        <div className="p-6 h-full flex-auto">
            <div className="h-full flex flex-col">
                <p>
                    Are you sure you want to close your {balances?.base ?? 0 < 0 ? 'short' : 'long'} position of{' '}
                    {Math.abs(balances?.base ?? 0)} {tracerId?.split('/')[0]}?
                </p>
                <p>
                    This trade will be made at the best available market price.
                    <br />
                    If you want to partially close your position go to the{' '}
                    <Link href="/trade/basic">
                        <a className="underline hover:text-blue-100 hover:underline">trading</a>
                    </Link>{' '}
                    page.
                </p>
                <div className="mt-auto justify-center">
                    <button
                        className="mb-5 button"
                        onClick={(e) => {
                            e.preventDefault();
                            close();
                        }}
                    >
                        Close Position
                    </button>
                </div>
            </div>
        </div>
    );
};

const TradeButtons: React.FC<{ tracer: string }> = ({ tracer }) => {
    const [show, setShow] = useState(false);
    return (
        <td className="cCell">
            <div className="flex flex-row">
                <Link href={`/trade/basic?tracer=${tracer}`}>
                    <div className="aCell font-bold">
                        <div className="mt-auto mb-auto w-full">
                            Trade
                            <FontAwesomeIcon
                                className="h-4 ml-3 inline-block"
                                size="sm"
                                color="#0000bd"
                                icon={faArrowRight}
                            />
                        </div>
                    </div>
                </Link>
                <div
                    className="aCell font-bold"
                    onClick={(e) => {
                        e.preventDefault;
                        setShow(true);
                    }}
                >
                    <div className="mt-auto mb-auto w-full">
                        Close
                        <FontAwesomeIcon
                            className="h-4 ml-3 inline-block"
                            size="sm"
                            color="#0000bd"
                            icon={faArrowRight}
                        />
                    </div>
                </div>
            </div>
            <TracerModal
                loading={false}
                show={show}
                onClose={() => setShow(false)}
                title={'Close Position'}
                subTitle={`Making this trade will setlle your current position within the ${tracer} market`}
            >
                <PositionClose />
            </TracerModal>
        </td>
    );
};

type RProps = {
    tracer: Tracer;
    setTracerId: ((tracerId: string) => any) | undefined;
    selected: boolean;
};

const Row_: React.FC<RProps> = ({ tracer, selected, setTracerId }) => {
    const balance = tracer?.balances;
    const price = tracer?.oraclePrice / (tracer?.priceMultiplier ?? 0);
    const marketId = tracer?.marketId;
    return (
        <TableRow
            key={marketId}
            onClick={() => (setTracerId ? setTracerId(marketId) : console.error('Failed to set tracer'))}
            rowSelected={selected}
            rowData={[
                marketId,
                `${toApproxCurrency(price)}`,
                `${toApproxCurrency(calcTotalMargin(balance.base, balance.quote, price))}`,
                balance.base === 0 ? 'NO POSITION' : balance.base < 0 ? 'SHORT' : 'LONG',
                `${toApproxCurrency(Math.abs(balance.base) * price)}`,
                `${toApproxCurrency(
                    calcLiquidationPrice(balance.quote, balance.base, price, tracer?.maxLeverage ?? 1),
                )}`,
                '',
            ]}
        >
            <TradeButtons tracer={marketId} />
        </TableRow>
    );
};

type PTProps = {
    tracers: Record<string, Tracer>;
};
//TODO: MAKE THIS COMPONENT MORE MODULAR BY TAKING IN ROWS AND COLUMNS
const PositionTable: React.FC<PTProps> = ({ tracers }: PTProps) => {
    const headings = [
        'Trace',
        'Market Price',
        'Total Account Value (USD)',
        'Position',
        'Position Notional (USD)',
        'Liquidation Price',
    ];
    const { tracerId, setTracerId } = useContext(TracerContext);
    return (
        <div className="p-6 overflow-scroll">
            <Table headings={headings}>
                {Object.keys(tracers).map((marketId) => (
                    <Row_
                        key={marketId}
                        tracer={tracers[marketId]}
                        setTracerId={setTracerId}
                        selected={tracerId === marketId}
                    />
                ))}
            </Table>
        </div>
    );
};

export default PositionTable;
