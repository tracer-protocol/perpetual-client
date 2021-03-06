// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context

import * as React from 'react';
import { useState, useEffect } from 'react';
import Onboard from '@tracer-protocol/onboard';
import { API as OnboardApi, Wallet, Initialization } from '@tracer-protocol/onboard/dist/src/interfaces';
import { formatEther } from '@ethersproject/units';
import { Network, networkConfig } from './Web3Context.Config';
import ApproveConnectionModal from '@components/Legal/ApproveConnectionModal';
import Web3 from 'web3';
import Cookies from 'universal-cookie';

export type OnboardConfig = Partial<Omit<Initialization, 'networkId'>>;

type Web3ContextProps = {
    cacheWalletSelection?: boolean;
    checkNetwork?: boolean;
    children: React.ReactNode;
    networkIds?: number[];
    onboardConfig?: OnboardConfig;
};

type Web3Context = {
    account?: string;
    ethBalance?: number;
    isReady: boolean;
    isMobile: boolean;
    network?: number;
    onboard?: OnboardApi;
    wallet?: Wallet;
    config?: Network;
    web3?: Web3;
    checkIsReady(): Promise<boolean>;
    resetOnboard(): void;
    handleConnect(): void;
};

const Web3Context = React.createContext<Web3Context | undefined>(undefined);
const DEFAULT_RPC = process.env.NEXT_PUBLIC_DEFAULT_RPC;
/**
 * Handles connection through BlockNative Onboard library
 */
const Web3Store: React.FC<Web3ContextProps> = ({
    children,
    onboardConfig,
    networkIds,
    cacheWalletSelection = true,
    checkNetwork = (networkIds && networkIds.length > 0) || false,
}) => {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [web3, setWeb3] = useState<Web3 | undefined>(DEFAULT_RPC ? new Web3(DEFAULT_RPC) : undefined);
    const [network, setNetwork] = useState<number | undefined>(undefined);
    const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [onboard, setOnboard] = useState<OnboardApi | undefined>(undefined);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [config, setConfig] = useState<Network>(networkConfig[0]);
    const [showTerms, setShowTerms] = useState<boolean>(false);
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
    const [proceed, setProceed] = useState<boolean>(false);

    // Initialize OnboardJS
    useEffect(() => {
        const initializeOnboard = async () => {
            const checks = [{ checkName: 'accounts' }, { checkName: 'connect' }];
            if (networkIds && checkNetwork) {
                checks.push({ checkName: 'network' });
            }

            try {
                const onboard = Onboard({
                    ...onboardConfig,
                    networkId: networkIds ? networkIds[0] : 42, //Default to kovan
                    walletCheck: checks,
                    subscriptions: {
                        address: (address) => {
                            console.info(`Changing address: ${address}`);
                            setAccount(address);
                            checkIsReady();
                            onboardConfig?.subscriptions?.address && onboardConfig?.subscriptions?.address(address);
                        },
                        wallet: (wallet) => {
                            if (wallet.provider) {
                                wallet.name &&
                                    cacheWalletSelection &&
                                    localStorage.setItem('onboard.selectedWallet', wallet.name);
                                setWallet(wallet);
                                setWeb3(new Web3(wallet.provider));
                            } else {
                                setWallet(undefined);
                            }
                            onboardConfig?.subscriptions?.wallet && onboardConfig.subscriptions.wallet(wallet);
                        },
                        network: (network) => {
                            if (!networkIds || networkIds.includes(network)) {
                                onboard.config({ networkId: network });
                            }
                            wallet && wallet?.provider && setWeb3(new Web3(wallet.provider));
                            setNetwork(network);
                            console.info(`Changing network ${network}`);
                            setConfig(networkConfig[network]);
                            checkIsReady();
                            onboardConfig?.subscriptions?.network && onboardConfig.subscriptions.network(network);
                        },
                        balance: (balance) => {
                            try {
                                const bal = Number(formatEther(balance));
                                !isNaN(bal) ? setEthBalance(bal) : setEthBalance(0);
                            } catch (error) {
                                setEthBalance(0);
                            }
                            onboardConfig?.subscriptions?.balance && onboardConfig.subscriptions.balance(balance);
                        },
                    },
                });

                const savedWallet = localStorage.getItem('onboard.selectedWallet');
                cacheWalletSelection && savedWallet && onboard.walletSelect(savedWallet);

                setOnboard(onboard);
            } catch (error) {
                console.error('Error initializing onboard', error);
            }
        };

        initializeOnboard();
    }, []);

    useEffect(() => {
        const cookies = new Cookies();
        if (acceptTerms && isReady) {
            cookies.set('acceptedTerms', 'true', { path: '/' });
            setShowTerms(false);
        }
        if (acceptTerms && proceed) {
            handleConnect();
            setShowTerms(false);
        }
    }, [acceptTerms, proceed, isReady]);

    const checkIsReady = async () => {
        const isReady = await onboard?.walletCheck();
        setIsReady(!!isReady);
        if (!isReady) {
            setEthBalance(0);
        }
        return !!isReady;
    };

    const resetOnboard = async () => {
        localStorage.setItem('onboard.selectedWallet', '');
        setIsReady(false);
        await onboard?.walletReset();
    };

    const acceptLegalTerms = () => {
        const cookies = new Cookies();
        if (cookies.get('acceptedTerms') !== 'true') {
            setShowTerms(true);
        } else {
            setShowTerms(false);
            setAcceptTerms(true);
        }
        return acceptTerms;
    };

    const handleConnect = async () => {
        if (onboard) {
            try {
                const accepted = acceptLegalTerms();
                if (accepted && proceed) {
                    await onboard?.walletSelect();
                    await checkIsReady();
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onboardState = onboard?.getState();
    return (
        <>
            <Web3Context.Provider
                value={{
                    account: account,
                    network: network,
                    ethBalance: ethBalance,
                    web3: web3,
                    wallet: wallet,
                    onboard: onboard,
                    isReady: isReady,
                    checkIsReady,
                    resetOnboard,
                    handleConnect,
                    config,
                    isMobile: !!onboardState?.mobileDevice,
                }}
            >
                {children}
            </Web3Context.Provider>
            <ApproveConnectionModal
                show={showTerms}
                setShow={setShowTerms}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                proceed={proceed}
                setProceed={setProceed}
            />
        </>
    );
};

const useWeb3: () => Web3Context = () => {
    const context = React.useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useOnboard must be used within a OnboardProvider');
    }
    return context;
};

export { Web3Store, useWeb3 };
