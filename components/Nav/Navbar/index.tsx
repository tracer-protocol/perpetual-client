import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const NavBar: React.FC = styled(({ className }) => {
    return (
        <div className={className} id="nav">
            <NavBarContent />
        </div>
    );
})`
    background-image: url('/img/nav-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
`;

export const NavBarContent = styled(({ className }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account, onboard, network, resetOnboard, ethBalance, handleConnect } = useWeb3();
    const ensName = useEnsName(account ?? '');

    const linkStyles = 'mx-2 py-2';

    return (
        <nav className={`${className} container`}>
            <HeaderSiteSwitcher />
            <ul>
                <li className={linkStyles + (route === 'trade' ? ' selected' : '')}>
                    {/*TODO: Add back basic/advanced trading toggle (change the file name and path config too)*/}
                    {/*<span className="trade-toggle">*/}
                    {/*    <Link href="/trade/basic">*/}
                    {/*        <div className={`${secondaryRoute === 'basic' ? 'selected' : ''}`}>Basic</div>*/}
                    {/*    </Link>*/}
                    {/*    <Link href="/trade/advanced">*/}
                    {/*        <div className={`${secondaryRoute === 'advanced' ? 'selected' : ''}`}>Advanced</div>*/}
                    {/*    </Link>*/}
                    {/*</span>*/}
                    {/*<Link href="/trade/basic">*/}
                    {/*    <a className="m-auto">Trade</a>*/}
                    {/*</Link>*/}
                    <Link href="/">
                        <a className="m-auto">Trade</a>
                    </Link>
                </li>
                {/*<li className={linkStyles + (route === 'insurance' ? ' selected' : '')}>*/}
                {/*    <Link href="/insurance/pools">*/}
                {/*        <a className="m-auto ">Insurance</a>*/}
                {/*    </Link>*/}
                {/*</li>*/}
                <li className={linkStyles + (route === 'insurance' ? ' selected' : '')}>
                    <Link href="/insurance">
                        <a className="m-auto ">Insurance</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'portfolio' ? ' selected' : '')}>
                    <Link href="/portfolio">
                        <a className="m-auto">Portfolio</a>
                    </Link>
                </li>
            </ul>
            <AccountDropdown
                onboard={onboard}
                account={account}
                ensName={ensName}
                network={network ?? 0}
                tokenBalance={ethBalance ?? 0}
                logout={resetOnboard}
                handleConnect={handleConnect}
            />

            {/** TODO this will need to change to Arbritrum network id */}
            {process.env.NEXT_PUBLIC_DEPLOYMENT !== 'DEVELOPMENT' ? (
                <UnknownNetwork display={network !== 421611 && !!network} />
            ) : null}
        </nav>
    );
})`
    display: flex;
    color: var(--color-text);
    height: var(--height-header);

    background-image: url('/img/nav-bg.png');
    background-repeat: no-repeat;
    background-size: cover;

    > ul {
        display: flex;
        margin-left: auto;
        margin-bottom: 0;
        font-size: 14px;
    }

    > ul li {
        display: flex;
        transition: 0.2s;
        padding: 0 20px;
    }

    > ul li.selected {
        color: #37b1f6;
    }

    > ul li:hover {
        color: #37b1f6;
    }

    > ul li .trade-toggle {
        display: none;
    }

    > ul li.selected .trade-toggle {
        display: flex;
        margin: auto 20px;
        border: 1px solid var(--color-primary);
        border-radius: 20px;
    }

    > ul li.selected .trade-toggle div {
        width: 100px;
        text-align: center;
        transition: 0.2s;

        &:hover {
            cursor: pointer;
        }
    }

    > ul li.selected .trade-toggle div.selected {
        color: var(--color-background);
        background-color: var(--color-primary);
        border-radius: 20px;
    }
`;

export default NavBar;

// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import HeaderSiteSwitcher from './HeaderSiteSwitcher';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import AccountDropdown from './AccountDropdown';

const switchNetworks = async () => {
    // @ts-ignore
    const ethereum = window.ethereum;
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x66EEB' }], //arbitrum
        });
    } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (error.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: '0x66EEB', rpcUrl: 'https://rinkeby.arbitrum.io/rpc' }],
                });
            } catch (addError) {
                // handle "add" error
            }
        }
        // handle other "switch" errors
    }
};

const NetworkButton = styled.span`
    border: 1px solid #fff;
    transition: 0.3s;
    border-radius: 20px;
    padding: 0 10px;
    &:hover {
        cursor: pointer;
        background: #fff;
        color: #f15025;
    }
`;

type UNProps = {
    display: boolean;
    className?: string;
};
const UnknownNetwork: React.FC<UNProps> = styled(({ className }: UNProps) => {
    // TODO add an onclick to swap to arbritrum using
    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
    return (
        <div className={className}>
            You are connected to the wrong network. Switch to{' '}
            <NetworkButton onClick={() => switchNetworks()}>Arbitrum Testnet.</NetworkButton>
        </div>
    );
})`
    background: #f15025;
    color: var(--color-text);
    letter-spacing: -0.36px;
    height: 40px;
    line-height: 40px;
    font-size: var(--font-size-medium);
    width: 100%;
    position: absolute;
    left: 0;
    text-align: center;
    bottom: ${(props) => (props.display ? '-40px' : '0px')};
    opacity: ${(props) => (props.display ? '1' : '0')};
    z-index: ${(props) => (props.display ? '2' : '-1')};
    transition: ${(props) =>
        props.display ? 'bottom 0.3s, opacity 0.3s 0.1s' : 'bottom 0.3s 0.15s, opacity 0.3s, z-index 0.3s 0.3s'};
`;

const useEnsName = (account: string) => {
    const [ensName, setEnsName] = useState(account);
    const [ens, setEns] = useState(undefined);
    const { web3 } = useWeb3();

    useEffect(() => {
        if (web3?.currentProvider) {
            const provider = web3.currentProvider;
            const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
            setEns(ens);
        }
    }, [web3]);

    useEffect(() => {
        if (!!ens && !!account) {
            const getEns = async () => {
                try {
                    const name = await (ens as ENS).getName(account);
                    if (name.name) {
                        setEnsName(name.name);
                    }
                } catch (err) {
                    console.error('Failed to fetch ens name', err);
                }
            };
            getEns();
        }
    }, [ens, account]);

    return ensName;
};
