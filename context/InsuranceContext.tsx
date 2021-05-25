import React, { useEffect, useContext, useState, useReducer } from 'react';
import { Children, InsurancePoolInfo, Result } from 'types';
import { Web3Context } from './Web3Context';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Insurance } from '@tracer-protocol/contracts/types/Insurance';
import insuranceJSON from '@tracer-protocol/contracts/abi/contracts/Insurance.sol/Insurance.json';
import { TracerContext } from './TracerContext';
import { checkAllowance } from 'libs/web3/utils';
import { FactoryContext } from '.';
import { Tracer } from 'libs';
import { BigNumber } from 'bignumber.js';

export const defaults: Record<string, any> = {
    userBalance: new BigNumber(0),
    target: new BigNumber(0),
    liquidity: new BigNumber(0),
    rewards: new BigNumber(0),
    health: new BigNumber(0),
    apy: new BigNumber(0),
    buffer: new BigNumber(0),
};

export type InsuranceAction =
    | { type: 'setAll'; state: InsurancePoolInfo; marketId: string }
    | { type: 'setUserBalance'; balance: BigNumber; marketId: string }
    | { type: 'setLiquidity'; liquidity: BigNumber; marketId: string }
    | { type: 'setHealth'; health: BigNumber; marketId: string }
    | { type: 'setTarget'; target: BigNumber; marketId: string }
    | {
          type: 'setBalances';
          liquidity: BigNumber;
          balance: BigNumber;
          target: BigNumber;
          marketId: string;
          health: BigNumber;
      };

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
    const { account, web3 } = useContext(Web3Context);
    const { tracers } = useContext(FactoryContext);
    const { selectedTracer } = useContext(TracerContext);
    const [contract, setContract] = useState<Insurance>();

    const initialState = {
        pools: {
            'LINK/USDC': {
                market: 'LINK/USDC',
                userBalance: new BigNumber(100),
                target: new BigNumber(6000),
                liquidity: new BigNumber(5000),
                rewards: new BigNumber(0),
                health: new BigNumber(0),
                apy: new BigNumber(0),
                buffer: new BigNumber(200),
            } as InsurancePoolInfo,
            'ETH/USDC': {
                market: 'ETH/USDC',
                userBalance: new BigNumber(200),
                target: new BigNumber(5000),
                liquidity: new BigNumber(6000),
                rewards: new BigNumber(0),
                health: new BigNumber(0),
                apy: new BigNumber(0),
                buffer: new BigNumber(200),
            } as InsurancePoolInfo,
        },
    };

    const reducer = (state: State, action: InsuranceAction) => {
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
            case 'setBalances':
                return {
                    ...state,
                    pools: {
                        [action.marketId]: {
                            ...state.pools[action.marketId],
                            liquidity: action.liquidity,
                            target: action.target,
                            health: action.health,
                            userBalance: action.balance,
                        },
                    },
                };
            default:
                throw new Error('Dispatch function not recognised');
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (web3 && selectedTracer && selectedTracer.insuranceContract) {
            console.log(selectedTracer.insuranceContract, 'Insurance contract');
            const setter = async () => {
                await selectedTracer.initialised;
                setContract(
                    new web3.eth.Contract(
                        insuranceJSON as AbiItem[],
                        selectedTracer.insuranceContract,
                    ) as unknown as Insurance,
                );
            };
            setter();
        }
    }, [web3, selectedTracer]);

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
            const err = await checkAllowance(selectedTracer.token, account, selectedTracer.insuranceContract, amount);
            if (err.error) {
                return err;
            }
            await contract?.methods
                .stake(new BigNumber(amount).times(new BigNumber(10).pow(selectedTracer.quoteTokenDecimals)).toString())
                .send({ from: account });
            updatePoolBalances();
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
                .withdraw(Web3.utils.toWei(amount.toString()))
                .send({ from: account });
            updatePoolBalances();
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
        if (tracerAddress && contract) {
            const userBalance_ = account
                ? contract?.methods.getPoolUserBalance(account as string).call()
                : Promise.resolve('0'); // we dont want it all to fail if account isnt connected
            const rewards_ = '0';
            const buffer_ = '0';
            const target_ = contract?.methods.getPoolTarget().call();
            const liquidity_ = contract?.methods.collateralAmount().call();
            const res = await Promise.all([userBalance_, rewards_, target_, liquidity_, buffer_]);
            const liquidity = res[3] ? new BigNumber(Web3.utils.fromWei(res[3])) : defaults.liquidity;
            const target = res[2] ? new BigNumber(Web3.utils.fromWei(res[2])) : defaults.target;
            const health = liquidity.div(target);
            dispatch({
                type: 'setAll',
                marketId: marketId,
                state: {
                    market: marketId,
                    userBalance: res[0] ? new BigNumber(Web3.utils.fromWei(res[0] as string)) : defaults.userBalance,
                    target: target,
                    liquidity: liquidity,
                    rewards: res[1] ? new BigNumber(Web3.utils.fromWei(res[1])) : defaults.rewards,
                    health: health.lt(1) ? health.times(100) : defaults.health,
                    apy: defaults.apy,
                    buffer: res[4] ? new BigNumber(Web3.utils.fromWei(res[4])) : defaults.buffer,
                },
            });
        } // else
        console.error('Failed to fetch pool data: Tracer address undefined');
    };

    const updatePoolBalances: () => void = () => {
        if (!selectedTracer?.address) {
            return {
                status: 'error',
                message: 'Failed to fetch balances: Selected tracer address cannot be undefined',
            };
        } else if (!contract) {
            return { status: 'error', message: 'Failed to fetch balances: Contract cannot be undefined' };
        }
        const userBalance_ = contract?.methods.getPoolUserBalance(account as string).call();
        const target_ = contract?.methods.getPoolTarget().call();
        const liquidity_ = contract?.methods.collateralAmount().call();
        Promise.all([userBalance_, target_, liquidity_])
            .then((res) => {
                const target = res[1] ? new BigNumber(Web3.utils.fromWei(res[1])) : defaults.target;
                const liquidity = res[2] ? new BigNumber(Web3.utils.fromWei(res[2])) : defaults.liquidity;
                const health = !target.eq(0) ? liquidity.div(target) : defaults.health;
                dispatch({
                    type: 'setBalances',
                    marketId: selectedTracer?.marketId,
                    balance: res[0] ? new BigNumber(Web3.utils.fromWei(res[0])) : defaults.userBalance,
                    target: target,
                    liquidity: liquidity,
                    health: health,
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
            updatePoolBalances();
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
                    ...(selectedPool as InsurancePoolInfo),
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
