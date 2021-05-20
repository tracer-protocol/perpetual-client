import React, {
    useContext,
    useEffect,
    // useState
} from 'react';
import { Children, Result } from 'types';
import { Web3Context } from './Web3Context';
// import Web3 from 'web3';
// import { AbiItem } from 'web3-utils';
import { TracerContext } from './TracerContext';
import { checkAllowance } from 'libs/web3/utils';
interface ContextProps {
    deposit: (amount: number) => any;
    withdraw: (amount: number) => any;
}

export const AccountContext = React.createContext<Partial<ContextProps>>({});

type StoreProps = Children;

export const AccountStore: React.FC<StoreProps> = ({ children }: StoreProps) => {
    const { account, web3, updateGlobal, config } = useContext(Web3Context);
    const { selectedTracer } = useContext(TracerContext);
    // const [contract, setContract] = useState<Account>();
    const accountAddress = config?.contracts.account.address ?? '';

    useEffect(() => {
        if (web3 && accountAddress) {
            // setContract((new web3.eth.Contract(accountJSON.abi as AbiItem[], accountAddress) as unknown) as Account);
        }
    }, [web3, accountAddress]);

    /**
     *
     * @param amount the amount to deposit
     */
    const deposit: (amount: number) => Promise<Result> = async (amount) => {
        try {
            if (!selectedTracer?.address) {
                return { status: 'error', message: 'Failed to deposit: Selected tracer address cannot be undefined' };
            }
            const err = await checkAllowance(selectedTracer?.token, account, accountAddress, amount);
            if (err?.error) {
                return err;
            }
            // await contract?.methods
            //     .deposit(Web3.utils.toWei(amount.toString()), selectedTracer.address)
            //     .send({ from: account });
            await selectedTracer?.updateUserBalance(account);
            updateGlobal ? updateGlobal() : console.error('Global update function not set');
            return { status: 'success', message: 'Successfully made deposit request' };
        } catch (err) {
            return { status: 'error', message: `Failed to withdraw from margin account: ${err.message}` };
        }
    };

    const withdraw: (amount: number) => Promise<Result> = async (_amount) => {
        if (!selectedTracer?.address) {
            return { status: 'error', message: 'Failed to withdraw: Selected tracer address cannot be undefined' };
        }
        try {
            // const result = await contract?.methods
            //     .withdraw(Web3.utils.toWei(amount.toString()), selectedTracer?.address)
            //     .send({ from: account });
            await selectedTracer?.updateUserBalance(account);
            updateGlobal ? updateGlobal() : console.error('Global update function not set');
            return {
                status: 'success',
                // message: `Successfully withdrew from margin account, ${result?.transactionHash}`,
            };
        } catch (err) {
            return { status: 'error', message: `Failed to withdraw from margin account: ${err.message}` };
        }
    };

    // useEffect(() => contract && account && selectedTracer?.address && getAccountData(), [contract, account, selectedTracer]) // eslint-disable-line

    return (
        <AccountContext.Provider
            value={{
                deposit,
                withdraw,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};
