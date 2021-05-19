import React, { useEffect, useContext, useState, useReducer } from 'react';
import { Children, InsurancePoolInfo, Result } from 'types';
import { Web3Context } from './Web3Context';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Insurance } from '@tracer-protocol/contracts/types/web3-v1-contracts/Insurance';
import insuranceJSON from '@tracer-protocol/contracts/build/contracts/Insurance.json';
import { TracerContext } from './TracerContext';
import { checkAllowance } from 'libs/web3/utils';
import { FactoryContext } from '.';
import { Tracer } from 'libs';
interface ContextProps {
    poolInfo: InsurancePoolInfo;
    deposit: (amount: number) => Promise<Result>;
    withdraw: (amount: number) => Promise<Result>;
    contract: Insurance;
    pools: Record<string, InsurancePoolInfo>;
}

interface State {
    pools: Record<string, InsurancePoolInfo>;
}

/**
 *
 */
export const InsuranceContext = React.createContext<Partial<ContextProps>>({});

export const InsuranceStore: React.FC<Children> = ({ children }: Children) => {
    const { account, web3, config } = useContext(Web3Context);
    const { tracers } = useContext(FactoryContext);
    const { selectedTracer } = useContext(TracerContext);
    const [contract, setContract] = useState<Insurance>();
    const insuranceAddress = config?.contracts.insurance.address ?? '';

    const initialState = {
        pools: {
            'LINK/USDC': {
                market: 'LINK/USDC',
                userBalance: 100,
                target: 6000,
                liquidity: 5000,
                rewards: 0,
                health: 0,
                apy: 0,
                buffer: 200,
            } as InsurancePoolInfo,
            'ETH/USDC': {
                market: 'ETH/USDC',
                userBalance: 200,
                target: 5000,
                liquidity: 6000,
                rewards: 0,
                health: 0,
                apy: 0,
                buffer: 200,
            } as InsurancePoolInfo,
        },
    };

    const reducer = (state: State, action: any) => {
        switch (action.type) {
            case 'setUserBalance':
                return {
                    ...state,
                    pools: {
                        [action.marketId]: {
                            ...state.pools[action.marketId ?? 'undefined'],
                            userBalance: action.balance,
                        },
                    },
                };
            case 'setAll':
                return {
                    ...state,
                    pools: {
                        [action.marketId]: {
                            ...action.state,
                        },
                    },
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (web3 && insuranceAddress) {
            setContract(
                (new web3.eth.Contract(insuranceJSON.abi as AbiItem[], insuranceAddress) as unknown) as Insurance,
            );
        }
    }, [web3, insuranceAddress]);

    const fetchPoolData = async () => {
        Promise.all(
            Object.values(tracers as Record<string, Tracer>).map((tracer: Tracer) =>
                getPoolData(tracer.address, tracer.marketId),
            ),
        );
    };

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
    const getPoolData: (tracerAddress: string, marketId: string) => Promise<void> = async (tracerAddress, marketId) => {
        if (tracerAddress) {
            const userBalance_ = account
                ? contract?.methods.getPoolUserBalance(tracerAddress, account as string).call()
                : Promise.resolve('0'); // we dont want it all to fail if account isnt connected
            const rewards_ = contract?.methods.getRewardsPerToken(tracerAddress).call();
            const target_ = contract?.methods.getPoolTarget(tracerAddress).call();
            const liquidity_ = contract?.methods.getPoolHoldings(tracerAddress).call();
            const res = await Promise.all([userBalance_, rewards_, target_, liquidity_]);
            const liquidity = res[3] ? parseFloat(Web3.utils.fromWei(res[3])) : 0;
            const target = res[2] ? parseFloat(Web3.utils.fromWei(res[2])) : 0;
            const health = liquidity / target;
            dispatch({
                type: 'setAll',
                marketId: marketId,
                state: {
                    market: marketId,
                    userBalance: res[0] ? parseFloat(Web3.utils.fromWei(res[0] as string)) : 0,
                    target: target,
                    liquidity: liquidity,
                    rewards: res[1] ? parseFloat(Web3.utils.fromWei(res[1])) : 0,
                    health: health < 1 ? health * 100 : 100,
                    apy: 0,
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
                dispatch({
                    type: 'setUserBalance',
                    marketId: selectedTracer?.marketId,
                    balance: res ? parseFloat(Web3.utils.fromWei(res)) : 0,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (tracers && contract) {
            fetchPoolData();
        }
    }, [tracers, contract]);

    useEffect(() => {
        if (tracers && contract && account) {
            updatePoolBalance();
        }
    }, [selectedTracer, account]);

    useEffect(() => {
        if (contract && account && selectedTracer?.address) {
            getPoolData(selectedTracer?.address, selectedTracer?.marketId);
        }
    }, [contract, account, selectedTracer]) // eslint-disable-line

    const selectedPool: InsurancePoolInfo = (state.pools as Record<string, InsurancePoolInfo>)[
        selectedTracer?.marketId as string
    ];

    return (
        <InsuranceContext.Provider
            value={{
                poolInfo: {
                    ...selectedPool,
                },
                deposit,
                withdraw,
                contract,
                pools: state.pools,
            }}
        >
            {children}
        </InsuranceContext.Provider>
    );
};
