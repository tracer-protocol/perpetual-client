import React, { useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Web3Context } from 'context';

export const ConnectButton: React.FC = () => {
    const { connect } = useContext(Web3Context);
    const { addToast } = useToasts();

    const handleConnect = async (e: any) => {
        e.preventDefault();
        try {
            connect ? connect() : false;
        } catch (err) {
            addToast(`Wallet connection failed. ${err}`, {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    };

    return (
        <button className="mb-5 button" onClick={handleConnect}>
            Connect wallet
        </button>
    );
};

export default ConnectButton;
