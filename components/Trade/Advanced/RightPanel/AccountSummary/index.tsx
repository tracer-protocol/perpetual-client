import React, { FC, useState, useContext } from 'react';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
import { Table } from '@components/General/Table/AccountTable';
import { OMEContext } from '@context/OMEContext';
import CustomSubNav from './CustomSubNav';
import PositionTab from '@components/Trade/Advanced/RightPanel/AccountSummary/Position';
import OrdersTab from '@components/Trade/Advanced/RightPanel/AccountSummary/Orders';
import FillsTab from '@components/Trade/Advanced/RightPanel/AccountSummary/Fills';

interface ASProps {
    selectedTracer: Tracer | undefined;
    className?: string;
}
const AccountSummary: FC<ASProps> = styled(({ selectedTracer, className }: ASProps) => {
    const [tab, setTab] = useState(0);
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const fairPrice = selectedTracer?.getFairPrice() ?? defaults.fairPrice;
    const {
        omeState,
        omeDispatch = () => {
            console.error('OME dispatch is undefined');
        },
        filledOrders,
    } = useContext(OMEContext);

    const content = () => {
        switch (tab) {
            case 0:
                return (
                    <PositionTab
                        balances={balances}
                        fairPrice={fairPrice}
                        maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                        baseTicker={selectedTracer?.baseTicker ?? defaults.baseTicker}
                        quoteTicker={selectedTracer?.quoteTicker ?? defaults.quoteTicker}
                        filledOrders={filledOrders ?? []}
                    />
                );
            case 1:
                return (
                    <OrdersTab
                        userOrders={omeState?.userOrders ?? []}
                        baseTicker={selectedTracer?.baseTicker ?? defaults.baseTicker}
                        refetch={() => omeDispatch({ type: 'refetchUserOrders' })}
                    />
                );
            case 2:
                return <FillsTab filledOrders={filledOrders ?? []} />;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <CustomSubNav
                selected={tab}
                setTab={setTab}
                fills={filledOrders?.length ?? 0}
                orders={omeState?.userOrders?.length ?? 0}
            />
            {content()}
        </div>
    );
})`
    border-top: 1px solid #0c3586;
    height: 50vh;
    overflow: auto;
`;

export default AccountSummary;

export const STable = styled(Table)`
    > tbody {
        display: block;
        max-height: 15vh;
        overflow-y: scroll;
    }
    > thead {
        display: table;
        table-layout: fixed; /* even columns width , fix width of table too*/
        width: calc(100% - 5px) !important; /* scrollbar is 5px */
    }
    > tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed; /* even columns width , fix width of table too*/
        overflow: auto;
    }
`;
