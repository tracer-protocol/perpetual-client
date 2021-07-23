// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context

import * as React from 'react';
import { useState, useEffect } from 'react';
import Onboard from '@tracer-protocol/onboard';
import { API as OnboardApi, Wallet, Initialization } from '@tracer-protocol/onboard/dist/src/interfaces';
import { formatEther } from '@ethersproject/units';
import { Network, networkConfig } from './Web3Context.Config';
import Web3 from 'web3';
import Cookies from 'universal-cookie';
import { Checkbox, CheckboxContainer, CheckboxTitle } from '@components/General';
import TracerModal from '@components/General/TracerModal';
import styled from 'styled-components';
import Link from 'next/link';

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

export const Terms = styled.div`
    background: var(--color-background);
    border-radius: 7px;
    padding: 16px;
    margin-top: 8px;

    p {
        color: #fff;
        font-size: var(--font-size-small);
        margin-bottom: 8px;
    }

    a {
        font-size: var(--font-size-small);
        color: var(--color-primary);
    }
`;

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
    const [showTerms, setShowTerms] = useState<boolean>(false);
    const [acceptedTerms, acceptTerms] = useState(false);

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
        if (acceptedTerms) {
            cookies.set('acceptedTerms', 'true', { path: '/' });
            handleConnect();
            setShowTerms(false);
        }
    }, [acceptedTerms]);

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
            acceptTerms(true);
        }
        return acceptedTerms;
    };

    const handleConnect = async () => {
        if (onboard) {
            try {
                const accepted = acceptLegalTerms();
                if (accepted) {
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
            <TracerModal
                loading={false}
                show={showTerms}
                id="legal-modal"
                onClose={() => {
                    acceptTerms(false);
                    setShowTerms(false);
                }}
                title="Connect Wallet"
            >
                <Terms>
                    <p>
                        By connecting your wallet, you accept Tracer’s Terms of Use and represent and warrant that you
                        are not a resident of any of the following countries:
                    </p>
                    <p>
                        China, the United States, Antigua and Barbuda, Algeria, Bangladesh, Bolivia, Belarus, Burundi,
                        Myanmar (Burma), Cote D’Ivoire (Ivory Coast), Crimea and Sevastopol, Cuba, Democratic Republic
                        of Congo, Ecuador, Iran, Iraq, Liberia, Libya, Magnitsky, Mali, Morocco, Nepal, North Korea,
                        Somalia, Sudan, Syria, Venezuela, Yemen or Zimbabwe.
                    </p>
                    <Link href="/terms-of-use">
                        <a target="_blank" rel="noreferrer">
                            Read More
                        </a>
                    </Link>
                </Terms>
                <CheckboxContainer
                    onClick={(e: any) => {
                        e.preventDefault();
                        acceptTerms(!acceptedTerms);
                    }}
                    id="checkbox-container"
                >
                    <Checkbox checked={acceptedTerms} />
                    <CheckboxTitle>I agree to Tracer’s Terms of use</CheckboxTitle>
                </CheckboxContainer>
            </TracerModal>
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
