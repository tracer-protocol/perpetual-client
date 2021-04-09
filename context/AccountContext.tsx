import React, { useContext, useEffect } from 'react';
import { Children } from 'types';
import { Web3Context } from './Web3Context';
import { networkConfig } from './Web3Context.Config';
import { useDispatch, useSelector } from 'react-redux';
import { Contract } from '@lions-mane/web3-redux';
import Web3 from 'web3';
import { TracerContext } from './TracerContext';
import { checkAllowance } from '@components/libs/web3/utils';

interface ContextProps {
    deposit: (amount: number) => any;
    withdraw: (amount: number) => any;
}

export const AccountContext = React.createContext<Partial<ContextProps>>({});

type StoreProps = Children;

export const AccountStore: React.FC<StoreProps> = ({ children }: StoreProps) => {
    const { account, networkId: _networkId, web3, config } = useContext(Web3Context);
    const { selectedTracer, tracerInfo } = useContext(TracerContext);
    const tracerBaseToken = tracerInfo?.tracerBaseToken;
    const contracts = config?.contracts;

    const accountAddress = _networkId
        ? Web3.utils.toChecksumAddress(networkConfig[_networkId]?.contracts.account.address as string)
        : '';

    const contractCalls: { method: string; sync: any; args: any[] }[] = [];

    const contract = useSelector((state) =>
        Contract.selectSingle(state, `${_networkId?.toString()}-${accountAddress}`),
    ) as Contract.Contract | undefined;

    const reduxDispatch = useDispatch();

    const contractId = contract?.id ?? '';
    const networkId = contract?.networkId ?? '';
    const address = contract?.address ?? '';

    useEffect(() => {
        if (!!contractId && !!networkId && !!account) {
            contractCalls.map(({ method, sync, args }) => {
                reduxDispatch(
                    Contract.callSynced({
                        networkId: networkId,
                        address: address,
                        method: method,
                        sync: sync,
                        args: args,
                    }),
                );
            });
        }
    }, [contractId, networkId, account]);

    const deposit = async (amount: number) => {
        await checkAllowance(
            web3,
            tracerBaseToken as string,
            account as string,
            contracts?.account.address as string,
            amount,
        );
        reduxDispatch(
            Contract.send({
                networkId,
                address,
                method: 'deposit',
                args: [Web3.utils.toWei(amount.toString()), selectedTracer?.address],
                from: account as string,
            }),
        );
    };

    const withdraw = (amount: number) => {
        reduxDispatch(
            Contract.send({
                networkId,
                address,
                method: 'withdraw',
                args: [Web3.utils.toWei(amount.toString()), selectedTracer?.address],
                from: account as string,
            }),
        );
    };

    return (
        <AccountContext.Provider
            value={{
                deposit,
                withdraw,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
