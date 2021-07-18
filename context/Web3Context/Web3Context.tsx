// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context

import * as React from 'react';
import { useState, useEffect } from 'react';
import Onboard from 'bnc-onboard';
import { API as OnboardApi, Wallet, Initialization } from 'bnc-onboard/dist/src/interfaces';
import { formatEther } from '@ethersproject/units';
import { Network, networkConfig } from './Web3Context.Config';
import Web3 from 'web3';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import dynamic from 'next/dynamic';
import { tourConfig } from '@components/Trade/Advanced/TourSteps'
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
    const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
    const [network, setNetwork] = useState<number | undefined>(undefined);
    const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [onboard, setOnboard] = useState<OnboardApi | undefined>(undefined);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [config, setConfig] = useState<Network>(networkConfig[0]);

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

    const checkIsReady = async () => {
        const isReady = await onboard?.walletCheck();
        setIsReady(!!isReady);
        if (!isReady) {
            setEthBalance(0);
            triggerTutorial();
        }
        return !!isReady;
    };

    const triggerTutorial = async () => {
        // If cookie with flag does not exists,
        // start tutorial
        setTourOpen(true);
    };

    const resetOnboard = async () => {
        localStorage.setItem('onboard.selectedWallet', '');
        setIsReady(false);
        await onboard?.walletReset();
    };

    const handleConnect = async () => {
        if (onboard) {
            try {
                await onboard?.walletSelect();
                await checkIsReady();
            } catch (err) {
                console.error(err);
            }
        }
    }

    const onboardState = onboard?.getState();

    // Reactour
    const Tour = dynamic(import('reactour'), { ssr: false });
    const [isTourOpen, setTourOpen] = useState<boolean>(false);

    const closeTour = () => {
        setTourOpen(false);

        // Reset the elements affected by the tour

        // Show the 'No Position Open' again
        const positionOverlay = document.querySelector('div[class*="PositionOverlay__StyledOverlay"]') as HTMLElement;
        if (positionOverlay) {
            positionOverlay.style.display = 'block';
        }

        // Disable the 'Close Position' button
        const closeOrderButton = document.querySelector('button[class*="OrderButtons__CloseOrder"]') as HTMLButtonElement;
        if (closeOrderButton) {
            closeOrderButton.disabled = true;
        }
    };

    const highlightDots = (e: HTMLDivElement) => {
        e.addEventListener('click', function () {
            const navDots: Array<any> = Array.from(document.querySelectorAll('nav[data-tour-elem="navigation"] button'));
            var currentIndex = 0;
            // Wait for Reactour to apply styling
            setTimeout(function(){
                navDots.map((dot, i) => { 
                    if(dot.classList.contains('reactour__dot--is-active')){
                        currentIndex = i;
                    }
                });
                navDots.slice(0, currentIndex).map((dot) => {
                    dot.classList.add('reactour__dot--is-active');
                });
            }, 10);
        });
        // Also prevent body scrolling when tour open
        disableBodyScroll(e);
    }

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
            <Tour
                onRequestClose={closeTour}
                steps={tourConfig as Array<any>}
                maskSpace={0}
                isOpen={isTourOpen}
                maskClassName="mask"
                className="helper"
                rounded={5}
                showNumber={false}
                onAfterOpen={(e) => highlightDots(e)}
                onBeforeClose={(e) => enableBodyScroll(e)}
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
