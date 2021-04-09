import { useContext, useMemo } from 'react';
import { InsurancePoolInfo, Result } from 'types';
import { Web3Context } from '@context/Web3Context';
import { Contract } from '@lions-mane/web3-redux';
import Web3 from 'web3';
import { checkAllowance } from '@libs/web3/utils';
import { useDispatch, useSelector } from 'react-redux';

const useContractMemo = (
    contractId: string | undefined,
    args: (string | number | undefined)[],
    method: string,
    account: string | undefined,
) => {
    const _value = useSelector((state) =>
        Contract.selectContractCall(state, contractId ?? '', method, {
            args: args,
            from: account ?? undefined,
        }),
    );
    const value = useMemo(() => {
        return _value ? parseFloat(Web3.utils.fromWei(_value)) : 0;
    }, [_value]);

    return value;
};

interface Pool {
    poolInfo: InsurancePoolInfo;
    deposit: (amount: number) => Promise<Result>;
    withdraw: (amount: number) => Promise<Result>;
}

export const usePool: (
    tracer: {
        token: string;
        address: string;
        id: string;
    },
    insuranceAddress: string,
) => Pool = (tracer, insuranceAddress) => {
    const { account, networkId: _networkId, web3 } = useContext(Web3Context);
    const contract = useSelector((state) => Contract.selectSingle(state, `${_networkId}-${insuranceAddress}`));
    // const contractId: string = contract?.id ?? '';
    const networkId: string = contract?.networkId ?? '';
    const address: string = contract?.address ?? '';
    const reduxDispatch = useDispatch();

    const deposit: (amount: number) => Promise<Result> = async (amount) => {
        if (!tracer) {
            return { status: 'error', message: 'Failed to deposit: No Tracer found' };
        } else if (!account) {
            return { status: 'error', message: 'Failed to deposit: No from address found' };
        }

        await checkAllowance(web3, tracer.token as string, account as string, address as string, amount);
        reduxDispatch(
            Contract.send({
                networkId,
                address,
                method: 'stake',
                args: [Web3.utils.toWei(amount.toString()), tracer?.address],
                from: account as string,
            }),
        );
        return { status: 'success', message: 'Successfully made deposit request' };
    };

    const withdraw: (amount: number) => Promise<Result> = async (amount) => {
        if (!tracer) {
            return { status: 'error', message: 'Failed to withdraw: No Tracer found' };
        } else if (!account) {
            return { status: 'error', message: 'Failed to withdraw: No from address found' };
        }
        reduxDispatch(
            Contract.send({
                networkId,
                address,
                method: 'withdraw',
                args: [Web3.utils.toWei(amount.toString()), tracer.address],
                from: account as string,
            }),
        );
        return { status: 'success', message: 'Successfully withdrew from insurance pool' };
    };

    // use all getters
    const userBalance = useContractMemo(contract?.id, [tracer.address, account], 'getPoolUserBalance', account);
    const liquidity = useContractMemo(contract?.id, [tracer.address], 'getPoolHoldings', account);
    const target = useContractMemo(contract?.id, [tracer.address], 'getPoolTarget', account);

    return {
        poolInfo: {
            liquidity,
            target,
            userBalance,
            market: tracer.id,
            rewards: 0, // TODO fetch this
        },
        deposit,
        withdraw,
    };
};
