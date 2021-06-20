import React, { useEffect, useContext, useState, useReducer } from 'react';
import { Children, InsurancePoolInfo } from 'types';
import { Web3Context } from './Web3Context';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Insurance } from '@tracer-protocol/contracts/types/Insurance';
import insuranceJSON from '@tracer-protocol/contracts/abi/contracts/Insurance.sol/Insurance.json';
import { TracerContext } from './TracerContext';
import { FactoryContext } from '.';
import { Tracer } from 'libs';
import { BigNumber } from 'bignumber.js';
import { initialFactoryState } from './FactoryContext';
import PromiEvent from 'web3/promiEvent';
import { TransactionContext } from './TransactionContext';
// @ts-ignore
import { TransactionReceipt } from 'web3/types';

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
    deposit: (amount: number, _callback?: () => void) => void;
    withdraw: (amount: number, _callback?: () => void) => void;
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
    const { factoryState: { tracers } = initialFactoryState } = useContext(FactoryContext);
    const { selectedTracer } = useContext(TracerContext);
    const { handleTransaction } = useContext(TransactionContext);
    const [contract, setContract] = useState<Insurance>();

    const initialState = {
        pools: {},
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
        if (web3 && selectedTracer?.getInsuranceContract()) {
            setContract(
                new web3.eth.Contract(
                    insuranceJSON as AbiItem[],
                    selectedTracer.getInsuranceContract(),
                ) as unknown as Insurance,
            );
        }
    }, [web3, selectedTracer?.getInsuranceContract()]);

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
    const deposit = async (amount: number, _callback?: () => any) => {
        if (!selectedTracer?.address) {
            console.error('Failed to withdraw: Selected tracer address is undefined');
        } else if (!account) {
            console.error('Failed to withdraw: No connected account');
        } else if (handleTransaction && !!selectedTracer && !!contract) {
            const approved = await selectedTracer?.checkAllowance(account, selectedTracer.getInsuranceContract());
            if (approved === 0) {
                // not approved
                handleTransaction(selectedTracer?.approve, [account, selectedTracer.getInsuranceContract()]);
            }
            const callFunc: (amount: number) => PromiEvent<TransactionReceipt> = (amount: number) =>
                contract?.methods
                    .deposit(Web3.utils.toWei(amount.toString()))
                    .send({ from: account }) as PromiEvent<TransactionReceipt>;
            handleTransaction(callFunc, [amount], {
                callback: () => {
                    updatePoolBalances();
                    _callback ? _callback() : null;
                },
            });
        } else {
            console.error(`Failed to withdraw from insurance pool: No deposit function found`);
        }
    };

    const withdraw = async (amount: number, _callback?: () => any) => {
        if (!selectedTracer?.address) {
            console.error('Failed to withdraw: Selected tracer address is undefined');
        } else if (handleTransaction) {
            // @ts-ignore
            const callFunc: (amount: number) => PromiEvent<TransactionReceipt> = (amount: number) =>
                contract?.methods.withdraw(Web3.utils.toWei(amount.toString())).send({ from: account });
            handleTransaction(callFunc, [amount], {
                callback: () => {
                    updatePoolBalances();
                    _callback ? _callback() : null;
                },
            });
        } else {
            console.error(`Failed to withdraw from insurance pool: No deposit function found`);
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
            let splitId = marketId.split("/")
            const iPoolTokenName = `i${splitId[0]}-${splitId[1]}`
            const iTokenAddress = await contract?.methods.token().call()
            const iTokenURL = `${config?.previewUrl}/address/${iTokenAddress}`
            // const etherscanLink = `https://${network}.etherscan.io/address/${iTokenAddress}`
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
                    iPoolTokenURL: iTokenURL,
                    iPoolTokenName: iPoolTokenName
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
    }, [contract, account, selectedTracer]); // eslint-disable-line

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
