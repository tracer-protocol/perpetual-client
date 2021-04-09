import React, { useEffect, useContext, useRef } from 'react';
import { usePool } from '@hooks/InsuranceHooks';
import { Children, InsurancePoolInfo, Result, Tracer } from 'types';
import { TracerContext } from './TracerContext';
import { Web3Context } from './Web3Context';
import { Contract } from '@lions-mane/web3-redux';
import Web3 from 'web3';
import { networkConfig } from './Web3Context.Config';
import { useDispatch, useSelector } from 'react-redux';

interface ContextProps {
    poolInfo: InsurancePoolInfo;
    deposit: (amount: number, tracer: Tracer | undefined) => Promise<Result>;
    withdraw: (amount: number, tracer: Tracer | undefined) => Promise<Result>;
}

/**
 *
 */
export const InsuranceContext = React.createContext<Partial<ContextProps>>({});

export const InsuranceStore: React.FC<Children> = ({ children }: Children) => {
    const reduxDispatch = useDispatch();
    const { account, networkId: _networkId } = useContext(Web3Context);
    const { tracerId, selectedTracer, tracerInfo } = useContext(TracerContext);
    const initiated = useRef(false);
    const tracer = selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer?.address) : '';
    const insuranceAddress = networkConfig[_networkId ?? 0]?.contracts.insurance.address;

    const contract = useSelector((state) => Contract.selectSingle(state, `${_networkId}-${insuranceAddress}`));
    // const contractId: string = contract?.id ?? '';
    const networkId: string = contract?.networkId ?? '';
    // const address: string = contract?.address ?? '';

    const ready = !!contract && !!account && !!tracer && !!networkId && !!insuranceAddress;

    useEffect(() => {
        if (ready && !initiated.current) {
            initiated.current = true;
            reduxDispatch(
                Contract.callSynced({
                    networkId: networkId?.toString() as string,
                    address: insuranceAddress as string,
                    method: 'getPoolUserBalance',
                    sync: false,
                    args: [tracer, account],
                    from: account,
                }),
            );
            // reduxDispatch(
            //     Contract.callSynced({
            //         networkId: networkId?.toString() as string,
            //         address: insuranceAddress as string,
            //         method: 'getPoolTarget',
            //         sync: Contract.CALL_TRANSACTION_SYNC,
            //         options: {
            //             args: [tracer]
            //         },
            //         args: [tracer],
            //         from: account
            //     }),
            // );
            // reduxDispatch(
            //     Contract.callSynced({
            //         networkId: networkId?.toString() as string,
            //         address: insuranceAddress as string,
            //         method: 'getPoolHoldings',
            //         sync: Contract.CALL_TRANSACTION_SYNC,
            //         args: [tracer],
            //         from: account
            //     }),
            // );
        }
    });

    const { deposit, withdraw, poolInfo } = usePool(
        {
            token: tracerInfo?.tracerBaseToken ?? '',
            address: selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer?.address) : '',
            id: tracerId ?? '',
        },
        insuranceAddress as string,
    );

    return (
        <InsuranceContext.Provider
            value={{
                poolInfo,
                deposit,
                withdraw,
            }}
        >
            {children}
        </InsuranceContext.Provider>
    );
};
