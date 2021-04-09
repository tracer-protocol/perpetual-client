import React, { useContext, useState } from 'react';
import { TracerContext, Web3Context } from 'context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Table, { TableRow } from '@components/Tables';
import TracerModal from '@components/Modals';
import { useClosePosition, useTracer, useTracerOrders } from '@hooks/TracerHooks';

import Link from 'next/link';
import Web3 from 'web3';
import { accountGain } from '@libs/utils';
import { Tracer, TracerInfo } from '@components/types';

type PCProps = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const PositionClose: ({ setLoading, setShow }: PCProps) => any = ({ setLoading, setShow }: PCProps) => {
    const { web3 } = useContext(Web3Context);
    const { tracerInfo, selectedTracer, tracerId } = useContext(TracerContext);
    const { balance } = tracerInfo as TracerInfo;
    const openOrders = useTracerOrders(web3 as Web3, selectedTracer as Tracer);
    const closingOrders = useClosePosition(balance?.position ?? 0, openOrders);
    console.debug(closingOrders);

    const close = async () => {
        setLoading(true);
        setShow(false);
    };

    return (
        <div className="p-6 h-full flex-auto">
            <div className="h-full flex flex-col">
                <p>
                    Are you sure you want to close your {balance?.position ?? 0 < 0 ? 'short' : 'long'} position of{' '}
                    {Math.abs(balance?.position ?? 0)} {tracerId?.split('/')[0]}?
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
    const [loading, setLoading] = useState(false);

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
                loading={loading}
                show={show}
                onClose={() => setShow(false)}
                title={'Close Position'}
                subTitle={`Making this trade will setlle your current position within the ${tracer} market`}
            >
                <PositionClose setShow={setShow} setLoading={setLoading} />
            </TracerModal>
        </td>
    );
};

type RProps = {
    tracer: string;
    marketId: string;
    setTracerId: ((tracerId: string) => any) | undefined;
    tracerId: string | undefined;
};

const Row_: React.FC<RProps> = ({ tracer, marketId, setTracerId, tracerId }) => {
    const info = useTracer(Web3.utils.toChecksumAddress(tracer));
    const price = info?.oraclePrice / info?.priceMultiplier;
    return (
        <TableRow
            key={marketId}
            onClick={() => (setTracerId ? setTracerId(marketId) : console.error('Failed to set tracer'))}
            rowSelected={tracerId === marketId}
            rowData={[
                marketId,
                `$${price}`,
                `$${accountGain(info?.balance.margin, info?.balance.deposited)}`,
                '-',
                `$${info?.balance.margin}`,
                info?.balance.position === 0 ? 'NO POSITION' : info?.balance.position < 0 ? 'SHORT' : 'LONG',
                `$${Math.abs(info?.balance.position) * price}`,
                '',
            ]}
        >
            <TradeButtons tracer={marketId} />
        </TableRow>
    );
};

type PTProps = {
    tracers: any;
};
//TODO: MAKE THIS COMPONENT MORE MODULAR BY TAKING IN ROWS AND COLUMNS
const PositionTable: React.FC<PTProps> = ({ tracers }: PTProps) => {
    const headings = [
        'Trace',
        'Market Price',
        'Gain (USD)',
        'Liquidation Price',
        'Tracer Margin (USD)',
        'Position',
        'Position Value (USD)',
    ];
    const { tracerId, setTracerId } = useContext(TracerContext);

    return (
        <div className="p-6 overflow-scroll">
            <Table headings={headings}>
                {Object.keys(tracers).map((marketId) => (
                    <Row_
                        tracer={tracers[marketId].address}
                        marketId={marketId}
                        setTracerId={setTracerId}
                        tracerId={tracerId}
                    />
                ))}
            </Table>
        </div>
    );
};

export default PositionTable;
