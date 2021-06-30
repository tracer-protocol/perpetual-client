import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import { Web3Context } from 'context';
import HeaderSiteSwitcher from './HeaderSiteSwitcher';

// const NetworkButton = styled.span`
//     border: 1px solid #fff;
//     transition: 0.3s;
//     border-radius: 20px;
//     padding: 0 10px;
//     &:hover {
//         cursor: pointer;
//         background: #fff;
//         color: #f15025;
//     }
// `;

type UNProps = {
    display: boolean;
    className?: string;
};
const UnknownNetwork: React.FC<UNProps> = styled(({ className }: UNProps) => {
    // TODO add an onclick to swap to arbritrum using
    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
    return (
        <div className={className}>
            You are connected to the wrong network.
            {/*Switch to <NetworkButton>Kovan Testnet.</NetworkButton>*/}
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
    const { provider } = useContext(Web3Context);

    useEffect(() => {
        if (provider) {
            const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
            setEns(ens);
        }
    }, [provider]);

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

const Identicon = dynamic(import('../Identicon'), { ssr: false });

const ConnectButton: React.FC<any> = styled.button`
    display: flex;
    border: 2px solid #fff;
    border-radius: 100px;
    width: 160px;
    height: 50px;
    transition: 0.2s;
    padding: 0 10px;
    margin: auto 10px;

    &:focus {
        outline: none;
    }

    &:hover {
        background: var(--color-primary);
    }
`;

const NavBar: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBarContent />
        </div>
    );
})`
    background-image: url('/img/nav-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
`;

const NavBarContent: React.FC = styled(({ className }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    // const secondaryRoute = routes[2];
    const { handleConnect, account, networkId } = useContext(Web3Context);
    const ensName = useEnsName(account ?? '');

    const buttonContent = () => {
        if (!account) {
            return 'Connect Wallet';
        }
        if (ensName) {
            const len = ensName.length;
            if (len > 14) {
                return `${ensName.slice(0, 7)}...${ensName.slice(len - 4, len)}`;
            } else {
                return ensName;
            }
        } else if (account) {
            return `${account.slice(0, 7)}...${account.slice(36, 40)}`;
        } else {
            return 'Connect Wallet';
        }
    };

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
                {/*TODO: Add back portfolio*/}
                {/*<li className={linkStyles + (route === 'portfolio' ? ' selected' : '')}>*/}
                {/*    <Link href="/portfolio">*/}
                {/*        <a className="m-auto">Portfolio</a>*/}
                {/*    </Link>*/}
                {/*</li>*/}
            </ul>
            <ConnectButton
                onClick={() => (handleConnect ? handleConnect() : console.error('Connect button is undefined'))}
            >
                <div className="m-auto flex text-sm font-bold">
                    <Identicon account={account ?? ''} />
                    <div className="px-2">{buttonContent()}</div>
                </div>
            </ConnectButton>

            {/** TODO this will need to change to arbritrum network id */}
            {process.env.NEXT_PUBLIC_DEPLOYMENT !== 'DEVELOPMENT' ? (
                <UnknownNetwork display={networkId !== 42 && !!networkId} />
            ) : null}
        </nav>
    );
})`
    display: flex;
    color: var(--color-text);
    height: 8vh;

    > ul {
        display: flex;
        margin-left: auto;
        margin-bottom: 0;
        font-size: 14px;
        letter-spacing: -0.28px;
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
