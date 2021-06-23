import { Machine, assign, send } from 'xstate';
import { initModal } from '@context/Web3Context';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

// The hierarchical (recursive) schema for the states
export interface Web3StateSchema {
    states: {
        initialisingModal: Record<string, unknown>;
        waiting: Record<string, unknown>;
        connected: {
            states: {
                idle: Record<string, unknown>;
                disconnecting: Record<string, unknown>;
                fetchingDetails: Record<string, unknown>;
                disconnectingFailed: Record<string, unknown>;
            };
        };
        connecting: Record<string, unknown>;
        failedToConnect: Record<string, unknown>;
        failedToInitModal: Record<string, unknown>;
    };
}

// The events that the machine handles
export type Web3Event =
    | { type: 'INIT_MODAL' }
    | { type: 'INIT_CONTRACTS' }
    | { type: 'CONNECT' }
    | { type: 'FETCH_DETAILS' }
    | { type: 'DISCONNECT' }
    | { type: 'UPDATE_ACCOUNT'; account: string }
    | { type: 'UPDATE_NETWORK'; networkId: string };

// The context (extended state) of the machine
export interface MachineContext {
    web3: Web3 | undefined;
    web3Modal: Web3Modal | undefined;
    initiatedContracts: boolean;
    account: string;
    networkId: number;
    errorMessage: undefined;
    provider: any;
}

export const web3Machine = Machine<MachineContext, Web3StateSchema, Web3Event>({
    id: 'web3Machine',
    initial: 'initialisingModal',
    context: {
        web3: undefined,
        web3Modal: undefined,
        initiatedContracts: false,
        account: '',
        networkId: 0, // default to none
        errorMessage: undefined,
        provider: undefined,
    },
    states: {
        initialisingModal: {
            id: 'initialisingModal',
            invoke: {
                src: (_context, _event) => initModal(),

                onDone: [
                    {
                        target: '#waiting',
                        actions: [
                            assign({
                                web3Modal: (_context, event) => event.data,
                            }),
                            send('CONNECT'),
                        ],
                        cond: (_context, event) => event.data.cachedProvider, // connect straight away if there is a cache
                    },
                    {
                        target: '#waiting',
                        actions: [
                            assign({
                                web3Modal: (_context, event) => event.data,
                            }),
                        ],
                    },
                ],
                onError: {
                    target: 'failedToInitModal',
                },
            },
        },
        waiting: {
            id: 'waiting',
            on: {
                INIT_CONTRACTS: {
                    target: 'waiting',
                    actions: assign({
                        initiatedContracts: (_context, _event) => true,
                    }),
                    cond: (context, _event) => !context.initiatedContracts,
                },

                CONNECT: {
                    target: 'connecting',
                },
            },
        },
        connecting: {
            invoke: {
                id: 'connecting',
                src: async (context, _event) => context.web3Modal?.connect(),
                onDone: {
                    target: 'connected',
                    actions: assign({
                        provider: (_context, event) => {
                            return event.data;
                        },
                    }),
                },
                onError: {
                    target: 'waiting',
                    actions: assign({
                        errorMessage: (_context, event) => event.data,
                    }),
                },
            },
        },
        connected: {
            id: 'connected',
            initial: 'idle',
            entry: send('FETCH_DETAILS'),
            states: {
                idle: {
                    id: 'idle',
                    on: {
                        FETCH_DETAILS: 'fetchingDetails',
                        DISCONNECT: 'disconnecting',
                        UPDATE_ACCOUNT: {
                            target: 'idle',
                            actions: assign({
                                account: (_context, event) => event.account,
                            }),
                        },
                        UPDATE_NETWORK: {
                            target: 'idle',
                            actions: assign({
                                networkId: (_context, event) => {
                                    console.info(
                                        `Setting network ${event.networkId}`,
                                    );
                                    return parseInt(event.networkId);
                                },
                            }),
                        },
                    },
                },
                disconnecting: {
                    // @ts-ignore
                    invoke: {
                        id: 'disconnecting',
                        src: (context, _event) => async () => {
                            await context.web3Modal?.clearCachedProvider();
                            return true;
                        },
                        onDone: {
                            target: '#waiting',
                            actions: [
                                assign({ account: '' }),
                                assign({ networkId: 0 }),
                            ],
                        },
                        onError: {
                            target: 'disconnectingFailed',
                            actions: assign({
                                account: (_context, _event) => '',
                            }),
                        },
                    },
                },
                disconnectingFailed: {},
                fetchingDetails: {
                    invoke: {
                        id: 'fetchingDetails',
                        src: (context, _event) => async () => {
                            const accounts =
                                await context.web3?.eth.getAccounts();
                            const networkId =
                                await context.web3?.eth.getChainId();
                            return {
                                account: Web3.utils.toChecksumAddress(
                                    accounts?.[0] ?? '',
                                ),
                                networkId,
                            };
                        },
                        onDone: {
                            target: 'idle',
                            actions: [
                                assign({
                                    account: (_context, event) =>
                                        event.data.account,
                                }),
                                assign({
                                    networkId: (_context, event) =>
                                        event.data.networkId,
                                }),
                            ],
                        },
                        onError: 'idle',
                    },
                },
            },
        },
        failedToConnect: {},
        failedToInitModal: {},
    },
});
