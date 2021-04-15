import React, { useEffect, useContext, useState, useReducer } from 'react';
import { Children, InsurancePoolInfo, Result } from 'types';
import { Web3Context } from './Web3Context';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Insurance } from '@tracer-protocol/contracts/types/web3-v1-contracts/Insurance';
import insuranceJSON from '@tracer-protocol/contracts/build/contracts/Insurance.json';
import { TracerContext } from './TracerContext';
import { checkAllowance } from '@components/libs/web3/utils';
const insuranceAddress = process.env.NEXT_PUBLIC_INSURANCE_ADDRESS;
interface ContextProps {
    poolInfo: InsurancePoolInfo;
    deposit: (amount: number) => Promise<Result>;
    withdraw: (amount: number) => Promise<Result>;
    contract: Insurance;
    health: number;
}

/**
 *
 */
export const InsuranceContext = React.createContext<Partial<ContextProps>>({});

export const InsuranceStore: React.FC<Children> = ({ children }: Children) => {
    const { account, web3 } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);
    const [contract, setContract] = useState<Insurance>();

    const initialState = {
        market: selectedTracer?.marketId,
        userBalance: 0,
        target: 0,
        liquidity: 0,
        rewards: 0,
    } as InsurancePoolInfo;

    const reducer = (state: InsurancePoolInfo, action: any) => {
        switch (action.type) {
            case 'setUserBalance':
                return {
                    ...state,
                    userBalance: action.balance,
                };
            case 'setAll':
                return {
                    ...action.state,
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (web3) {
            setContract(
                (new web3.eth.Contract(insuranceJSON.abi as AbiItem[], insuranceAddress) as unknown) as Insurance,
            );
        }
    }, [web3]);

    /**
     *
     * @param amount the amount to deposit
     */
    const deposit: (amount: number) => Promise<Result> = async (amount) => {
        try {
            if (!selectedTracer?.address) {
                return { status: 'error', message: 'Failed to deposit: Selected tracer address cannot be undefined' };
            }
            const err = await checkAllowance(selectedTracer.token, account, insuranceAddress, amount);
            if (err.error) {
                return err;
            }
            await contract?.methods
                .stake(Web3.utils.toWei(amount.toString()), selectedTracer.address.toString())
                .send({ from: account });
            updatePoolBalance();
            return { status: 'success', message: 'Transaction success: Successfully made deposit' };
        } catch (err) {
            console.error(err);
            return { status: 'error', message: err, error: err };
        }
    };

    const withdraw: (amount: number) => Promise<Result> = async (amount) => {
        try {
            if (!selectedTracer?.address) {
                return { status: 'error', message: 'Failed to withdraw: Selected tracer address cannot be undefined' };
            }
            const result = await contract?.methods
                .withdraw(Web3.utils.toWei(amount.toString()), selectedTracer.address)
                .send({ from: account });
            updatePoolBalance();
            return {
                status: 'success',
                message: `Transaction success: Successfully withdrew from insurance pool, ${result?.transactionHash}`,
            };
        } catch (err) {
            return { status: 'error', message: `Transaction failed: ${err}` };
        }
    };

    /**
     *
     * @param tracerId tracer ID of the market, eg TEST/USD, only used as a label identifier
     * @param market tracer contract address
     * @param user account address
     */
    const getPoolData: () => Promise<void> = async () => {
        if (selectedTracer?.address) {
            const userBalance = contract?.methods.getPoolUserBalance(selectedTracer?.address, account as string).call();
            const rewards = contract?.methods.getRewardsPerToken(selectedTracer?.address).call();
            const target = contract?.methods.getPoolTarget(selectedTracer?.address).call();
            const liquidity = contract?.methods.getPoolHoldings(selectedTracer?.address).call();
            const res = await Promise.all([userBalance, rewards, target, liquidity]);

            dispatch({
                type: 'setAll',
                state: {
                    market: selectedTracer?.marketId,
                    userBalance: res[0] ? parseFloat(Web3.utils.fromWei(res[0])) : 0,
                    target: res[2] ? parseFloat(Web3.utils.fromWei(res[2])) : 0,
                    liquidity: res[3] ? parseFloat(Web3.utils.fromWei(res[3])) : 0,
                    rewards: res[1] ? parseFloat(Web3.utils.fromWei(res[1])) : 0,
                },
            });
        } // else
        console.error('Failed to fetch pool data: Tracer address undefined');
    };

    const updatePoolBalance: () => void = () => {
        if (!selectedTracer?.address) {
            return { status: 'error', message: 'Failed to withdraw: Selected tracer address cannot be undefined' };
        }
        Promise.resolve(contract?.methods.getPoolUserBalance(selectedTracer?.address, account as string).call())
            .then((res) => {
                dispatch({ type: 'setUserBalance', balance: res ? parseFloat(Web3.utils.fromWei(res)) : 0 });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // keep this out of poolInfo since if you are using poolInfo just derive it from target and liquidity
    // this is for if you only want this
    const health = state.liquidity / state.target;

    useEffect(() => {
        if (contract && account && selectedTracer?.address) {
            getPoolData();
        }
    }, [contract, account, selectedTracer]) // eslint-disable-line

    return (
        <InsuranceContext.Provider
            value={{
                poolInfo: {
                    ...state,
                    health: health < 1 ? health * 100 : 100,
                },
                deposit,
                withdraw,
                contract,
            }}
        >
            {children}
        </InsuranceContext.Provider>
    );
};
