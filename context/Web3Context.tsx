import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Fortmatic from 'fortmatic';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Children } from 'types';
import { FactoryStore } from './FactoryContext';
import { useMachine } from '@xstate/react';

import { web3Machine } from '@machines/Web3Machine';

import { networkConfig, Network as NetworkType } from './Web3Context.Config';

export const initModal = async () => {
    return new Web3Modal({
        network: 'mainnet',
        theme: 'dark',
        cacheProvider: true,
        providerOptions: {
            walletconnect: {
                display: {
                    name: 'WalletConnect',
                },
                package: WalletConnectProvider,
                options: {
                    infuraId: process.env.REACT_APP_INFURA_ID,
                },
            },
            fortmatic: {
                display: {
                    name: 'Fortmatic',
                },
                package: Fortmatic,
                options: {
                    key: process.env.REACT_APP_FORTMATIC_KEY,
                },
            },
        },
    });
};

/**
 * This class is used to control the order hooks throughout the making trade process
 *
 */
interface ContextProps {
    connect: () => void | undefined;
    updateTrigger: boolean;
    state: any;
    account: string;
    networkId: number;
    web3: Web3 | undefined;
    provider: any;
    config: NetworkType;
    updateGlobal: () => void | undefined;
}

export const Web3Context = React.createContext<Partial<ContextProps>>({
    connect: undefined,
    updateTrigger: undefined,
});

// TODO refactor this a little such that its a little easier to read
// Addition of more subscriptions to provider events such as
//  - new block header, should trigger a page update
//  - pending transaction should place the account in a loading state
export const Web3Store: React.FC<Children> = ({ children }: Children) => {
    // @ts-ignore
    const [trigger, setTrigger] = useState(false);

    // @ts-ignore
    const [state, send] = useMachine(web3Machine, {
        value: {},
        context: {
            web3: new Web3(Web3.givenProvider || 'ws://localhost:8545'),
            web3Modal: undefined,
            initiatedContracts: false,
            account: '',
            networkId: 0, // default to none
            errorMessage: undefined,
            provider: undefined,
        },
    });

    useEffect(() => {
        send('INIT_CONTRACTS');
    }, []);

    /* Connects the web3 provider using Web3Modal */
    const connect: () => void = async () => {
        if (!!state.matches('connected')) {
            console.info('Disconnecting Web3');
            send('DISCONNECT');
        }
        console.info('Connecting Web3');
        send('CONNECT');
    };

    useEffect(() => {
        if (!!state.context.provider && !!state.matches('connected')) {
            const provider = state.context.provider;
            provider.on('accountsChanged', (accounts: string[]) => {
                console.info('CHANGING ACCOUNTS', accounts);
                if (accounts.length === 0) {
                    //disconnecting
                    send('DISCONNECT');
                    send('UPDATE_ACCOUNT', {
                        account: ''
                    });
                } else {
                    send('UPDATE_ACCOUNT', {
                        account: Web3.utils.toChecksumAddress(accounts[0]),
                    });
                }
            });

            // Subscribe to chainId change
            provider.on('chainChanged', (chainId: string) => {
                send('UPDATE_NETWORK', {
                    networkId: parseInt(chainId),
                });
            });

            // Subscribe to provider disconnection
            provider.on('disconnect', (error: { code: number; message: string }) => {
                console.info(error);
            });
        }
    }, [state.context.provider]);

    const updateGlobal = () => {
        setTrigger(!trigger);
    };

    console.debug(`State: ${JSON.stringify(state.value)}`);

    // const network: Network.Network | undefined = useSelector((state) =>
    //     Network.selectSingle(state, state.context?.networkId ?? ''),
    // );
    const config = networkConfig[state.context.networkId ?? '1337'];
    console.log(JSON.stringify(config));
    return (
        <Web3Context.Provider
            value={{
                connect,
                updateTrigger: trigger,
                updateGlobal,
                ...state.context,
                state: state,
                config,
            }}
        >
            <FactoryStore>{children}</FactoryStore>
        </Web3Context.Provider>
    );
};
