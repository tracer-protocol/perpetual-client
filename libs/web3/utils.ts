import Web3 from 'web3';
import erc20JSON from '@tracer-protocol/contracts/build/contracts/ERC20.json';
import { AbiItem } from 'web3-utils';
import { Result } from 'types';

/**
 *gi
 * @param token token that is being deposited
 * @param from address
 * @param contractAddress insurance contract or individual tracer contract
 * @param amount amount that is being deposited
 */
export const checkAllowance: (
    web3: Web3 | undefined,
    tokenAddress: string,
    from: string,
    contractAddress: string,
    amount: number,
) => Promise<Result> = async (web3, tokenAddress, from, contractAddress, amount) => {
    if (!web3) {
        console.error('Could not find web3 provider');
        return;
    } else if (!from) {
        console.error('From address not specified');
        return;
    }
    const max = Number.MAX_SAFE_INTEGER;
    try {
        let result;
        const token = new web3.eth.Contract(erc20JSON.abi as AbiItem[], tokenAddress);
        const currentAllowed = await token.methods.allowance(from, contractAddress).call();
        console.info(`Allowance to spend ${currentAllowed}`);
        if (parseInt(Web3.utils.fromWei(currentAllowed)) < amount) {
            result = await token.methods
                .approve(contractAddress, Web3.utils.toWei(max.toString()))
                .send({ from: from });
            return result;
        }
    } catch (e) {
        return e;
    }
};
