import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useToasts } from 'react-toast-notifications';

import styled from 'styled-components';

// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import { Web3Context } from 'context';

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
    const handleClick = (e: any) => {
        e.preventDefault();
        setShow(!show);
        const dropdown = document.querySelector('.dropdown-menu-list');
        dropdown?.addEventListener('transitionend', () => { // add delay after open
            if (document.getElementById('menu')?.classList.contains('show')) {
                dropdown?.classList.add('delayed-transition');
            }
        });
        dropdown?.addEventListener('transitionend', () => { // remove delay after close
            if (!document.getElementById('menu')?.classList.contains('show')) {
                dropdown?.classList.remove('delayed-transition');
            }
        });
    }
    return (
        <div id="menu" className={`${className} ${show ? 'show' : ''}`} onClick={handleClick}>
            <img alt="Tracer Logo" className="logo" src="/img/logos/tracer_perps.svg"/>
            <img alt="down-arrow" className="down-arrow" src="/img/general/triangle_down.svg" />
            <div className="divide" />
            <div className={`dropdown-menu`}>
                <ul className="dropdown-menu-list">
                    <li className="nav-item">
                        {/* <img alt="Tracer Logo" src="/img/logos/tracer_perps.svg"/> */}
                    </li>
                    <li className="nav-item">
                        <img alt="Tracer Logo" src="/img/logos/tracer_main.svg"/>
                    </li>
                    <li className="nav-item">
                        <img alt="Tracer Logo" src="/img/logos/tracer_govern.svg"/>
                    </li>
                    <li className="nav-item">
                        <img alt="Tracer Logo" src="/img/logos/tracer_blog.svg"/>
                    </li>
                </ul>
            </div>
        </div>
    )
})`
    height: 100%;
    display: flex;
    width: 350px;
    margin-left: 5vw;
    position: relative;

    &:hover {
        cursor: pointer;
    }

    > .divide {
        height: 1px;
        width: 100%;
        position: absolute;
        bottom: 20px;
        background: #3DA8F5;
    }

    > .logo {
        height: 30px;
        margin-top: 3vh;
        z-index: 2;
    }

    > .down-arrow {
        height: 30px;
        width: 30px;
        top: 2.5vh;
        right: 0;
        position: absolute;
        z-index: 2;
        transition: 0.5s;
    }

    &.show > .down-arrow {
        transform: rotate(180deg);
        margin-top: 10px;
    }


    > .dropdown-menu {
        opacity: 0;
        position: absolute;
        display: block;
        height: 0;
        top: 10px;
        left: -30px;
        width: 400px;
        background: #3372e8;
        border-radius: 10px;
        transition: all 0.3s ease-in-out;
    }
    > .dropdown-menu ul {
        margin-top: 3vh;
        transition: all 0.3s ease-in-out;
        opacity: 0;
    }
    .delayed-transition {
        transition-delay: 0.3s!important;
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
    &.show > .dropdown-menu ul .nav-item {
        border-top: 1px solid #3DA8F5;
        transform: translateX(0);
        opacity: 1;
        &:hover {
            cursor: pointer;
            background-color: #3DA8F5;
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
        height: 400px;
    }

    
`

const ConnectButton: React.FC<any> = styled.button`
    display: flex;
    border: 2px solid #fff;
    border-radius: 20px;
    width: 150px;
    height: 50px;
    border: 2px solid #FFFFFF;
    transition: 0.2s;
    padding: 0 10px;
    margin: auto 20px;
    
    &:focus {
        outline: none;
    }
    &:hover {
        background: #3da8f5;
    }
`

const NavBar: React.FC = styled(({ className }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1]
    const secondaryRoute = routes[2]
    console.log(secondaryRoute)
    const { connect, account } = useContext(Web3Context);
    const ensName = useEnsName(account ?? '');
    const { addToast } = useToasts();

    const handleConnect = async () => {
        if (connect) {
            try {
                connect();
            } catch (err) {
                addToast(`Wallet connection failed. ${err}`, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        } else {
            console.error('No connect function found');
        }
    };

    const buttonContent = () => {
        if (!account) {
            return 'Connect Wallet'
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
        <nav className={className}>
            <DropdownLogo />
            <ul>
                <li className={linkStyles + (route === 'trade' ? ' selected' : '')}>
                <span className='trade-toggle'>
                        <Link href="/trade/basic">
                            <div className={`${secondaryRoute === 'basic' ? 'selected' : ''}`}>
                                    Basic
                            </div>
                        </Link>
                        <Link href="/trade/advanced">
                            <div className={`${secondaryRoute === 'advanced' ? 'selected' : ''}`}>
                                    Advanced
                            </div>
                        </Link>
                    </span>
                    <Link href="/trade/basic">
                        <a className="m-auto">Trade</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'pool' ? ' selected' : '')}>
                    <Link href="/pool">
                        <a className="m-auto">Pool</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'insurance' ? ' selected' : '')}>
                    <Link href="/insurance">
                        <a className="m-auto ">Insurance</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'account' ? ' selected' : '')}>
                    <Link href="/account/positions">
                        <a className="m-auto">Account</a>
                    </Link>
                </li>
            </ul>
            <ConnectButton
                onClick={() => handleConnect()}
            >
                <div className="m-auto flex text-sm font-bold">
                    <Identicon account={account ?? ''} />
                    <div className="px-2">
                        {buttonContent()}
                    </div>
                </div>
            </ConnectButton>
        </nav>
    );
})`
    background-color: #03065E;
    display: flex;
    width: 100%;
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
        color: #37B1F6;
    }

    > ul li:hover {
        color: #37B1F6;
    }

    > ul li .trade-toggle {
        display: none
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
        color: #03065E;
        background-color: #3DA8F5;
        border-radius: 20px;
    }

`

export default NavBar;
