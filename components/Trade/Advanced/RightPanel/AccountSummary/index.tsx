import React, { FC, useState, useContext, useRef, useEffect } from 'react';
import Tracer, { defaults } from '@libs/Tracer';
import styled from 'styled-components';
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

    const accountSummary = useRef(null);
    const [accountSummaryHeight, setAccountSummaryHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setAccountSummaryHeight(accountSummary?.current?.clientHeight);
    });

    const subNav = useRef(null);
    const [subNavHeight, setSubNavHeight] = useState(0);
    useEffect(() => {
        // @ts-ignore
        setSubNavHeight(subNav?.current?.clientHeight);
    }, [subNav]);

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
                        parentHeight={accountSummaryHeight - subNavHeight}
                    />
                );
            case 2:
                return (
                    <FillsTab filledOrders={filledOrders ?? []} parentHeight={accountSummaryHeight - subNavHeight} />
                );
            default:
                return;
        }
    };
    return (
        <div className={className} ref={accountSummary}>
            <div ref={subNav}>
                <CustomSubNav
                    selected={tab}
                    setTab={setTab}
                    fills={filledOrders?.length ?? 0}
                    orders={omeState?.userOrders?.length ?? 0}
                />
            </div>
            {content()}
        </div>
    );
})`
    border-top: 1px solid #0c3586;
    height: 50vh;
    overflow: auto;
`;

export default AccountSummary;
