import Web3 from 'web3';
import { Erc20 as ERC20Token } from '@tracer-protocol/contracts/types/web3-v1-contracts/ERC20';
import { Result } from 'types';

/**
 *gi
 * @param token token that is being deposited
 * @param from address
 * @param contractAddress insurance contract or individual tracer contract
 * @param amount amount that is being deposited
 */
export const checkAllowance: (
    token: ERC20Token | undefined,
    from: string | undefined,
    contractAddress: string | undefined,
    amount: number,
) => Promise<Result> = async (token, from, contractAddress, amount) => {
    const max = Number.MAX_SAFE_INTEGER;
    if (!from) return { status: 'error', message: 'From address undefined' }
    if (!contractAddress) return { status: 'error', message: 'Contract address undefined' }
    if (!token) return { status: 'error', message: 'Token cannot be undefined'}
    try {
        let result;
        const currentAllowed = await token.methods.allowance(from, contractAddress).call();
        console.info('Allowance to spend currentAllowed');
        if (parseInt(Web3.utils.fromWei(currentAllowed)) < amount) {
            result = await token.methods
                .approve(contractAddress, Web3.utils.toWei(max.toString()))
                .send({ from: from });
            return result;
        } //else
        return { status: 'success', message: 'User allowance > 0'}
    } catch (e) {
        return e;
    }
};