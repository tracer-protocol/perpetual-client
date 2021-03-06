import React, { useEffect, useContext, useReducer } from 'react';
import { Children, InsurancePoolInfo } from 'libs/types';
import Web3 from 'web3';
import { Insurance } from '@tracer-protocol/contracts/types/Insurance';
import { TracerContext } from './TracerContext';
import { FactoryContext } from '.';
import { BigNumber } from 'bignumber.js';
import { initialFactoryState } from './FactoryContext';
import PromiEvent from 'web3/promiEvent';
import { Options, TransactionContext } from './TransactionContext';
// @ts-ignore
import { TransactionReceipt } from 'web3/types';
import { calcInsuranceAPY } from '@tracer-protocol/tracer-utils';
import Tracer from '@libs/Tracer';
import { useWeb3 } from './Web3Context/Web3Context';

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
    | { type: 'CLEAR' }
    | {
          type: 'setPoolBalance';
          marketId: string;
          liquidity: BigNumber;
          target: BigNumber;
          health: BigNumber;
      };

interface ContextProps {
    poolInfo: InsurancePoolInfo;
    deposit: (tracer: Tracer, amount: number, options: Options) => void;
    withdraw: (tracer: Tracer, amount: number, options: Options) => void;
    approve: (tracer: Tracer, options?: Options) => void;
    contract: Insurance;
    pools: Record<string, InsurancePoolInfo>;
}

interface State {
    pools: Record<string, InsurancePoolInfo>;
}

export const InsuranceContext = React.createContext<Partial<ContextProps>>({});

/**
 * Handles responsiveness and state when interacting with the insurance pools.
 * The insurance contract class is stored in each of the Tracer classes.
 * Functions are called on the Insurance class.
 * This context store provides useEffect hooks and pool state updates to update the UI.
 * Also provides deposit and withdraw functions similar to the TracerContext
 */
export const InsuranceStore: React.FC<Children> = ({ children }: Children) => {
    const { account, config } = useWeb3();
    const { factoryState: { tracers, hasSetTracers } = initialFactoryState } = useContext(FactoryContext);
    const { selectedTracer } = useContext(TracerContext);
    const { handleTransaction } = useContext(TransactionContext);

    const initialState = {
        pools: {},
    };

    const reducer = (state: State, action: InsuranceAction) => {
        switch (action.type) {
            case 'setUserBalance':
                return {
                    ...state,
                    pools: {
                        ...state.pools,
                        [action.marketId]: {
                            ...state.pools[action.marketId],
                            market: action.marketId,
                            userBalance: action.balance,
                        },
                    },
                };
            case 'setAll':
                return {
                    ...state,
                    pools: {
                        ...state.pools,
                        [action.marketId]: {
                            ...action.state,
                        },
                    },
                };
            case 'setPoolBalance':
                return {
                    ...state,
                    pools: {
                        ...state.pools,
                        [action.marketId]: {
                            ...state.pools[action.marketId],
                            market: action.marketId,
                            liquidity: action.liquidity,
                            target: action.target,
                            health: action.health,
                        },
                    },
                };
            case 'CLEAR':
                return {
                    pools: {},
                };
            default:
                throw new Error('Dispatch function not recognised');
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const deposit = async (tracer: Tracer, amount: number, options: Options) => {
        if (!tracer?.address) {
            console.error('Failed to withdraw: Selected tracer address is undefined');
        } else if (!account) {
            console.error('Failed to withdraw: No connected account');
        } else if (handleTransaction && !!tracer) {
            const insuranceContract = tracer.getInsuranceContract();
            if (!!insuranceContract) {
                const approved = await selectedTracer?.checkAllowance(account, insuranceContract.address);
                if (approved === 0) {
                    // not approved
                    handleTransaction(tracer.approve, [account, insuranceContract.address]);
                }

                const callFunc: (amount: number) => PromiEvent<TransactionReceipt> = (amount: number) =>
                    insuranceContract?.instance?.methods
                        .deposit(Web3.utils.toWei(amount.toString()))
                        .send({ from: account }) as PromiEvent<TransactionReceipt>;
                const { onSuccess: onSuccess_ } = options ?? {};
                handleTransaction(callFunc, [amount], {
                    ...options,
                    onSuccess: () => {
                        updatePoolBalance(tracer);
                        updateUserBalance(tracer);
                        onSuccess_ ? onSuccess_() : null;
                    },
                    statusMessages: {
                        pending: 'Transaction to deposit USDC is pending',
                    },
                });
            } else {
                console.error('Failed to withdraw from insurance pool: Insurance contract undefined');
            }
        } else {
            console.error('Failed to withdraw from insurance pool: No deposit function found');
        }
    };

    const withdraw = async (tracer: Tracer, amount: number, options: Options) => {
        if (!tracer?.address) {
            console.error('Failed to withdraw: Selected tracer address is undefined');
        } else if (handleTransaction) {
            const insuranceContract = tracer.getInsuranceContract();
            // @ts-ignore
            const callFunc: (amount: number) => PromiEvent<TransactionReceipt> = (amount: number) =>
                insuranceContract?.instance?.methods
                    .withdraw(Web3.utils.toWei(amount.toString()))
                    .send({ from: account });
            const { onSuccess: onSuccess_ } = options ?? {};
            handleTransaction(callFunc, [amount], {
                onSuccess: () => {
                    updatePoolBalance(tracer);
                    updateUserBalance(tracer);
                    onSuccess_ ? onSuccess_() : null;
                },
            });
        } else {
            console.error('Failed to withdraw from insurance pool: No deposit function found');
        }
    };

    const approve = async (tracer: Tracer, options?: Options) => {
        const { onSuccess: onSuccess_ } = options ?? {};
        if (handleTransaction) {
            const insuranceContract = tracer.getInsuranceContract();
            if (!insuranceContract || !insuranceContract.address) {
                console.error('Failed to approve: contract is undefined');
                return false;
            }
            const onSuccess = () => {
                tracer?.setApproved(insuranceContract.address);
                onSuccess_ ? onSuccess_() : null;
            };

            handleTransaction(tracer.approve, [account, insuranceContract.address], {
                ...options,
                onSuccess,
                statusMessages: {
                    userConfirmed: `Unlock ${tracer.quoteTicker} Submitted`,
                    pending: `Transaction to unlock ${tracer.quoteTicker} is pending`,
                },
            });
        } else {
            console.error('Failed to approve: handleTransaction is undefined ');
        }
    };

    useEffect(() => {
        dispatch({
            type: 'CLEAR',
        });
    }, [config]);

    useEffect(() => {
        if (hasSetTracers) {
            Object.values(tracers).map(async (tracer) => {
                const insurance = tracer.getInsuranceContract();
                if (insurance) {
                    const marketId = tracer.marketId;
                    const insuranceFundingRate = tracer.getInsuranceFundingRate();
                    const leveragedNotionalValue = tracer.getLeveragedNotionalValue();
                    await insurance?.initialised;
                    const { liquidity, target, health, buffer } = await insurance.getPoolBalances();
                    const userBalance = await insurance.getUserBalance(account ?? '');
                    const apy = calcInsuranceAPY(insuranceFundingRate, liquidity, leveragedNotionalValue);
                    const splitId = marketId.split('/');
                    const iPoolTokenName = `i${splitId[0]}-${splitId[1]}`;
                    const iTokenAddress = await insurance.instance?.methods.token().call();
                    const iTokenURL = `${config?.previewUrl}/address/${iTokenAddress}`;
                    // const etherscanLink = `https://${network}.etherscan.io/address/${iTokenAddress}`
                    dispatch({
                        type: 'setAll',
                        marketId: marketId,
                        state: {
                            tracer: tracer,
                            market: marketId,
                            target: target,
                            userBalance: userBalance,
                            liquidity: liquidity,
                            rewards: defaults.rewards,
                            health: BigNumber.min(health, new BigNumber(100)),
                            apy: apy,
                            buffer: buffer,
                            iPoolTokenURL: iTokenURL,
                            iPoolTokenName: iPoolTokenName,
                        },
                    });
                }
            });
        } else {
            dispatch({ type: 'CLEAR' });
        }
    }, [hasSetTracers, config]);

    const updatePoolBalance = async (tracer: Tracer) => {
        const insurance = tracer.getInsuranceContract();
        if (insurance && account) {
            const poolBalances = await insurance.getPoolBalances();
            if (poolBalances) {
                dispatch({
                    type: 'setPoolBalance',
                    marketId: tracer.marketId,
                    ...poolBalances,
                });
            }
        }
    };

    const updateUserBalance = async (tracer: Tracer) => {
        const insurance = tracer.getInsuranceContract();
        if (insurance && account) {
            const userBalance = await insurance.getUserBalance(account);
            if (userBalance) {
                dispatch({
                    type: 'setUserBalance',
                    marketId: tracer.marketId,
                    balance: userBalance ?? defaults.userBalance,
                });
            }
        }
    };

    useEffect(() => {
        if (account && hasSetTracers) {
            Object.values(tracers).map(async (tracer) => {
                const insurance = tracer.getInsuranceContract();
                await insurance?.initialised;
                updateUserBalance(tracer);
            });
        }
    }, [hasSetTracers, account]);

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
                approve,
                pools: state.pools,
            }}
        >
            {children}
        </InsuranceContext.Provider>
    );
};
