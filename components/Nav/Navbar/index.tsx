import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import { Web3Context } from 'context';

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
    color: #fff;
    letter-spacing: -0.36px;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
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

const DropdownLogo = styled(({ className }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('menu');
            let target = e.target;
            do {
                if (target === menu) {
                    return;
                }
                // @ts-ignore
                target = target?.parentNode;
            } while (target);
            setShow(false);
        });
    }, []);

    const handleClick = (e: any) => {
        e.preventDefault();
        setShow(!show);
        const dropdown = document.querySelector('.dropdown-menu-list');
        dropdown?.addEventListener('transitionend', () => {
            // add delay after open
            if (document.getElementById('menu')?.classList.contains('show')) {
                dropdown?.classList.add('delayed-transition');
            }
        });
        dropdown?.addEventListener('transitionend', () => {
            // remove delay after close
            if (!document.getElementById('menu')?.classList.contains('show')) {
                dropdown?.classList.remove('delayed-transition');
            }
        });
    };
    return (
        <div id="menu" className={`${className} ${show ? 'show' : ''}`} onClick={handleClick}>
            <img alt="Tracer Logo" className="logo hidden lg:block z-10" src="/img/logos/tracer/tracer_perps.svg" />
            <img alt="down-arrow" className="down-arrow z-10" src="/img/general/triangle_down.svg" />
            <div className={`dropdown-menu`}>
                <ul className="dropdown-menu-list">
                    <li className="nav-item" />
                    <li className="nav-item highlight">
                        <Link href="https://tracer.finance">
                            <img alt="Tracer Logo" src="/img/logos/tracer/tracer_main.svg" />
                        </Link>
                    </li>
                    <li className="nav-item highlight">
                        <Link href="https://tracer.finance/govern/">
                            <img alt="Tracer Logo" src="/img/logos/tracer/tracer_govern.svg" />
                        </Link>
                    </li>
                    <li className="nav-item highlight">
                        <Link href="https://tracer.finance/radar/">
                            <img alt="Tracer Logo" src="/img/logos/tracer/tracer_blog.svg" />
                        </Link>
                    </li>
                    <li className="nav-item flex">
                        <Link href="https://discourse.tracer.finance/">
                            <img src="/img/socials/discourse.svg" alt="Discourse icon" />
                        </Link>
                        <Link href="https://github.com/tracer-protocol">
                            <img src="/img/socials/github.svg" alt="Github icon" />
                        </Link>
                        <Link href="https://discord.gg/kvJEwfvyrW">
                            <img src="/img/socials/discord.svg" alt="Discord icon" />
                        </Link>
                        <Link href="https://twitter.com/tracer_finance">
                            <img src="/img/socials/twitter.svg" alt="Twitter icon" />
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
})`
    height: 100%;
    display: flex;
    width: 350px;
    position: relative;

    &:hover {
        cursor: pointer;
    }

    > .logo {
        height: 30px;
        margin-top: 3vh;
    }

    > .down-arrow {
        height: 30px;
        width: 30px;
        top: 2.5vh;
        right: 0;
        position: absolute;
        margin-top: 0;
        transition: 0.5s;
    }

    &.show > .down-arrow {
        transform: rotate(180deg);
        margin-top: 10px;
    }

    > .dropdown-menu {
        position: absolute;
        opacity: 0;
        height: 0;
        top: 10px;
        left: -30px;
        width: 400px;
        background: #3372e8;
        border-radius: 10px;
        transition: all 0.3s ease-in-out;
        z-index: -1;
    }

    > .dropdown-menu ul {
        margin-top: 3vh;
        transition: all 0.3s ease-in-out;
        background: #3372e8;
        border-radius: 10px;
        opacity: 0;
    }

    .delayed-transition {
        transition-delay: 0.3s !important;
    }

    > .dropdown-menu ul .nav-item {
        background: transparent;
        border-top: transparent;
        padding: 20px 0;
        width: 100%;
        transform: translateX(20px);
        opacity: 0;
    }

    > .dropdown-menu ul img {
        height: 30px;
    }

    .dropdown-menu ul .nav-item:nth-child(1) {
        border-top: transparent;
        height: 70px; // 30px for logo and 40px for padding;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    > .dropdown-menu ul .nav-item:nth-child(2) {
        transition: all 0.3s ease-in-out, background 0.5s ease;
    }

    > .dropdown-menu ul .nav-item:nth-child(3) {
        transition: all 0.3s ease-in-out, background 0.5s ease;
    }
    > .dropdown-menu ul .nav-item:nth-child(4) {
        transition: all 0.3s ease-in-out, background 0.5s ease;
    }

    &.show > .dropdown-menu ul .nav-item:nth-child(2) {
        transition: all 0.3s ease-in-out 0.2s, background 0.5s ease;
    }

    &.show > .dropdown-menu ul .nav-item:nth-child(3) {
        transition: all 0.3s ease-in-out 0.3s, background 0.5s ease;
    }

    &.show > .dropdown-menu ul .nav-item:nth-child(4) {
        transition: all 0.3s ease-in-out 0.4s, background 0.5s ease;
    }

    &.show > .dropdown-menu ul .nav-item:nth-child(5) {
        transition: all 0.3s ease-in-out 0.4s, background 0.5s ease;
    }

    &.show > .dropdown-menu ul .nav-item {
        opacity: 1;
        border-top: 1px solid #3da8f5;
        transform: translateX(0);
        cursor: auto;

        > img {
            cursor: pointer;
        }
    }

    &.show > .dropdown-menu ul .nav-item.highlight {
        &:hover {
            cursor: pointer;
            background-color: #3da8f5;
        }
    }

    &.show > .dropdown-menu ul {
        margin-top: calc(3vh - 30px);
        opacity: 1;
    }

    .dropdown-menu ul .nav-item img {
        margin-left: 30px;
    }

    &.show > .dropdown-menu {
        opacity: 1;
        height: 280px;
        z-index: 5;
    }
`;

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
        background: #3da8f5;
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
            <DropdownLogo />
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
    color: #fff;
    height: 10vh;

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
        border: 1px solid #3da8f5;
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
        color: #000240;
        background-color: #3da8f5;
        border-radius: 20px;
    }
`;

export default NavBar;
