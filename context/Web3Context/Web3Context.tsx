// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context

import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import Onboard from 'bnc-onboard';
import {
  API as OnboardApi,
  Wallet,
  Initialization,
} from 'bnc-onboard/dist/src/interfaces';
import { providers, ethers, BigNumber, utils } from 'ethers';
import { BigNumber as BN } from 'bignumber.js';
import { formatEther } from '@ethersproject/units';
import { Erc20DetailedFactory } from './interfaces/Erc20DetailedFactory';
import { Erc20Detailed } from './interfaces/Erc20Detailed';
import { TokenInfo, Tokens, tokensReducer } from './tokensReducer';
import { Network, networkConfig } from './Web3Context.Config';
import Web3 from 'web3';

export type OnboardConfig = Partial<Omit<Initialization, 'networkId'>>;

type TokenConfig = {
  address: string;
  name?: string;
  symbol?: string;
  imageUri?: string;
};

type TokensToWatch = {
  [networkId: number]: TokenConfig[];
};

type Web3ContextProps = {
  cacheWalletSelection?: boolean;
  checkNetwork?: boolean;
  children: React.ReactNode;
  networkIds?: number[];
  onboardConfig?: OnboardConfig;
  spenderAddress?: string;
  tokensToWatch?: TokensToWatch; // Network-keyed collection of token addresses to watch
};

type Web3Context = {
  account?: string;
  ethBalance?: number;
  isReady: boolean;
  isMobile: boolean;
  network?: number;
  onboard?: OnboardApi;
  provider?: providers.Web3Provider;
  wallet?: Wallet;
  config?: Network;
  web3?: Web3;
  tokens: Tokens;
  checkIsReady(): Promise<boolean>;
  resetOnboard(): void;
  signMessage(message: string): Promise<string>;
};

const Web3Context = React.createContext<Web3Context | undefined>(undefined);

const Web3Provider = ({
  children,
  onboardConfig,
  networkIds,
  tokensToWatch,
  spenderAddress,
  cacheWalletSelection = true,
  checkNetwork = (networkIds && networkIds.length > 0) || false,
}: Web3ContextProps) => {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
  const [provider, setProvider] = useState<providers.Web3Provider | undefined>(
    undefined
  );
  const [network, setNetwork] = useState<number | undefined>(undefined);
  const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [onboard, setOnboard] = useState<OnboardApi | undefined>(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [config, setConfig] = useState<Network>(networkConfig[0])
  const [tokens, tokensDispatch] = useReducer(tokensReducer, {});

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
              setAccount(address);
              checkIsReady();
              onboardConfig?.subscriptions?.address &&
                onboardConfig?.subscriptions?.address(address);
            },
            wallet: (wallet) => {
              if (wallet.provider) {
                wallet.name &&
                  cacheWalletSelection &&
                  localStorage.setItem('onboard.selectedWallet', wallet.name);
                setWallet(wallet);
                setProvider(
                  new ethers.providers.Web3Provider(wallet.provider, 'any')
                );
                setWeb3(new Web3(wallet.provider))
              } else {
                setWallet(undefined);
              }
              onboardConfig?.subscriptions?.wallet &&
                onboardConfig.subscriptions.wallet(wallet);
            },
            network: (network) => {
              if (!networkIds || networkIds.includes(network)) {
                onboard.config({ networkId: network });
              }
                wallet && 
                wallet?.provider &&
                setProvider(
                  new ethers.providers.Web3Provider(wallet.provider, 'any')
                ) && setWeb3(new Web3(wallet.provider));
              setNetwork(network);
              console.info(`Changing network ${network}`)
              setConfig(networkConfig[network])
              checkIsReady();
              onboardConfig?.subscriptions?.network &&
                onboardConfig.subscriptions.network(network);
            },
            balance: (balance) => {
              try {
                const bal = Number(formatEther(balance));
                !isNaN(bal) ? setEthBalance(bal) : setEthBalance(0);
              } catch (error) {
                setEthBalance(0);
              }
              onboardConfig?.subscriptions?.balance &&
                onboardConfig.subscriptions.balance(balance);
            },
          },
        });

        const savedWallet = localStorage.getItem('onboard.selectedWallet');
        cacheWalletSelection &&
          savedWallet &&
          onboard.walletSelect(savedWallet);

        setOnboard(onboard);
      } catch (error) {
        console.log('Error initializing onboard');
        console.log(error);
      }
    };

    initializeOnboard();
  }, []);

  // Token balance and allowance listener
  // TODO: Allowance check not needed unless target is specificed
  useEffect(() => {
    const checkBalanceAndAllowance = async (
      token: Erc20Detailed,
      decimals: number
    ) => {
      if (account) {
        const bal = await token.balanceOf(account);
        const balance = Number(utils.formatUnits(bal, decimals));
        const balanceBN = new BN(bal.toString()).shiftedBy(-decimals);
        var spenderAllowance = 0;
        if (spenderAddress) {
          spenderAllowance = Number(
            utils.formatUnits(
              BigNumber.from(await token.balanceOf(account)),
              decimals
            )
          );
        }

        tokensDispatch({
          type: 'updateTokenBalanceAllowance',
          payload: {
            id: token.address,
            spenderAllowance: spenderAllowance,
            balance: balance,
            balanceBN,
          },
        });
      }
    };

    const networkTokens =
      (tokensToWatch && network && tokensToWatch[network]) || [];

    let tokenContracts: Array<Erc20Detailed> = [];
    if (provider && account && networkTokens.length > 0) {
      networkTokens.forEach(async (token) => {
        const signer = await provider.getSigner();
        const tokenContract = Erc20DetailedFactory.connect(
          token.address,
          signer
        );

        const newTokenInfo: TokenInfo = {
          decimals: 0,
          balance: 0,
          balanceBN: new BN(0),
          imageUri: token.imageUri,
          name: token.name,
          symbol: token.symbol,
          spenderAllowance: 0,
          allowance: tokenContract.allowance,
          approve: tokenContract.approve,
          transfer: tokenContract.transfer,
        };

        if (!token.name) {
          try {
            const tokenName = await tokenContract.name();
            newTokenInfo.name = tokenName;
          } catch (error) {
            console.log(
              'There was an error getting the token name. Does this contract implement ERC20Detailed?'
            );
          }
        }
        if (!token.symbol) {
          try {
            const tokenSymbol = await tokenContract.symbol();
            newTokenInfo.symbol = tokenSymbol;
          } catch (error) {
            console.error(
              'There was an error getting the token symbol. Does this contract implement ERC20Detailed?'
            );
          }
        }

        try {
          const tokenDecimals = await tokenContract.decimals();
          newTokenInfo.decimals = tokenDecimals;
        } catch (error) {
          console.error(
            'There was an error getting the token decimals. Does this contract implement ERC20Detailed?'
          );
        }

        tokensDispatch({
          type: 'addToken',
          payload: { id: token.address, token: newTokenInfo },
        });

        checkBalanceAndAllowance(tokenContract, newTokenInfo.decimals);

        // This filter is intentionally left quite loose.
        const filterTokenApproval = tokenContract.filters.Approval(
          account,
          null,
          null
        );
        const filterTokenTransferFrom = tokenContract.filters.Transfer(
          account,
          null,
          null
        );
        const filterTokenTransferTo = tokenContract.filters.Transfer(
          null,
          account,
          null
        );

        tokenContract.on(filterTokenApproval, () =>
          checkBalanceAndAllowance(tokenContract, newTokenInfo.decimals)
        );
        tokenContract.on(filterTokenTransferFrom, () =>
          checkBalanceAndAllowance(tokenContract, newTokenInfo.decimals)
        );
        tokenContract.on(filterTokenTransferTo, () =>
          checkBalanceAndAllowance(tokenContract, newTokenInfo.decimals)
        );
        tokenContracts.push(tokenContract);
      });
    }
    return () => {
      if (tokenContracts.length > 0) {
        tokenContracts.forEach((tc) => {
          tc.removeAllListeners();
        });
        tokenContracts = [];
        tokensDispatch({ type: 'resetTokens' });
      }
    };
  }, [network, provider, account]);

  const checkIsReady = async () => {
    const isReady = await onboard?.walletCheck();
    setIsReady(!!isReady);
    if (!isReady) {
      setEthBalance(0);
    }
    return !!isReady;
  };

  const signMessage = async (message: string) => {
    if (!provider) return Promise.reject('The provider is not yet initialized');

    const data = ethers.utils.toUtf8Bytes(message);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    const sig = await provider.send('personal_sign', [
      ethers.utils.hexlify(data),
      addr.toLowerCase(),
    ]);
    return sig;
  };

  const resetOnboard = () => {
    localStorage.setItem('onboard.selectedWallet', '');
    setIsReady(false);
    onboard?.walletReset();
  };

  const onboardState = onboard?.getState();

  return (
    <Web3Context.Provider
      value={{
        account: account,
        provider,
        network: network,
        ethBalance: ethBalance,
        web3: web3,
        wallet: wallet,
        onboard: onboard,
        isReady: isReady,
        checkIsReady,
        resetOnboard,
        config,
        isMobile: !!onboardState?.mobileDevice,
        tokens: tokens,
        signMessage,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useOnboard must be used within a OnboardProvider');
  }
  return context;
};

export { Web3Provider, useWeb3 };
