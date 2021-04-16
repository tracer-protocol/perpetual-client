import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useToasts } from 'react-toast-notifications';

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

const Identicon = dynamic(import('./Identicon'), { ssr: false });

const NavBar: React.FC = () => {
    const { connect, account } = useContext(Web3Context);

    const ensName = useEnsName(account ?? '');
    const route = useRouter().pathname.split('/')[1];
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
            return 'CONNECT WALLET';
        }
    };

    const linkStyles = 'flex-1 mx-2 hover:font-bold transition duration-300 text-1xl flex justify-center py-2';
    return (
        <nav className="flex space-between w-full bg-blue-100 text-white h-screen/7">
            <div className="w-1/6 h-full text-2xl font-semibold flex items-center justify-center px-4">
                <img alt="Tracer Logo" src="/img/tracer-logo.png" className="h-full w-auto"></img>
            </div>
            <ul className="flex w-1/4 mr-auto mb-0">
                <li className={linkStyles + (route === 'trade' ? ' font-bold' : '')}>
                    <Link href="/trade/basic">
                        <a className="m-auto text-white">TRADE</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'pool' ? ' font-bold' : '')}>
                    <Link href="/pool">
                        <a className="m-auto text-white">POOL</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'insurance' ? ' font-bold' : '')}>
                    <Link href="/insurance">
                        <a className="m-auto text-white">INSURANCE</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'account' ? ' font-bold' : '')}>
                    <Link href="/account/positions">
                        <a className="m-auto text-white">ACCOUNT</a>
                    </Link>
                </li>
            </ul>
            <div className="flex-1 sm:py-2 2xl:py-3 px-5 flex flex-rowitems-center">
                <button
                    onClick={() => handleConnect()}
                    className="group ml-auto flex border-2 border-blue-200 border-solid rounded-xxl w-48 focus:outline-none hover:shadow-xl hover:bg-white"
                >
                    <div className="m-auto flex text-sm font-bold">
                        <Identicon account={account ?? ''} />
                        <a className="px-2 text-white group-hover:text-blue-100">{buttonContent()}</a>
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
