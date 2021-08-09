import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import insuranceAbi from '@tracer-protocol/contracts/abi/contracts/Insurance.sol/Insurance.json';
import { AbiItem } from 'web3-utils';
import { Insurance as InsuranceType } from '@tracer-protocol/contracts/types/Insurance';

export const defaults: Record<string, any> = {
    userBalance: new BigNumber(0),
    target: new BigNumber(0),
    liquidity: new BigNumber(0),
    rewards: new BigNumber(0),
    health: new BigNumber(0),
    apy: new BigNumber(0),
    buffer: new BigNumber(0),
    iTokenAddress: '',
};

/**
 * Insurance class to separate some of the functionality from the Tracer class
 */
export default class Insurance {
    instance: InsuranceType; // contract instance
    address: string; // insurance contract address
    market: string; // parent Tracer market
    liquidity: BigNumber; // insurance pool liquidity
    target: BigNumber; // insurance pool target
    userBalance: BigNumber; // insurance pool user token balance
    rewards: BigNumber; // total insurance pool rewards
    health: BigNumber; // insurance pool health (percentile of current pool liquidity and pool target)
    apy: BigNumber; // insurance pool APY
    buffer: BigNumber; // set amount of pool liquidity that acts as the insurance pool buffer
    iTokenAddress: string; // insurance pool token address
    iPoolTokenName: string; // insurance pool token name
    initialised: Promise<boolean>; // boolean value to tell if this class has been initialised

    constructor(web3: Web3, address: string, marketId: string) {
        this.instance = new web3.eth.Contract(insuranceAbi as AbiItem[], address) as unknown as InsuranceType;
        this.address = address.slice();
        this.market = marketId;
        this.liquidity = defaults.liquidity;
        this.target = defaults.target;
        this.userBalance = defaults.userBalance;
        this.rewards = defaults.rewards;
        this.health = defaults.health;
        this.apy = defaults.apy;
        this.buffer = defaults.buffer;
        this.iTokenAddress = defaults.iPoolTokenURL;
        this.iPoolTokenName = defaults.iPoolTokenName;
        this.initialised = this.init();
    }

    /** Initialises this class. Sets the pools balances and iTokenAddress */
    init: () => Promise<boolean> = async () => {
        try {
            const iTokenAddress = await this.instance?.methods.token().call();
            this.iTokenAddress = iTokenAddress;
            await this.getPoolBalances();
            return true;
        } catch (err) {
            console.error('Failed to init insurance contract', err);
            return false;
        }
    };

    /**
     * Gets a target users account balance
     * @param account target user
     * @returns the parsed users account balance
     */
    getUserBalance: (account: string) => Promise<BigNumber> = async (account) => {
        if (account) {
            const userBalance_ = await this.instance?.methods.getPoolUserBalance(account as string).call();
            return userBalance_ ? new BigNumber(Web3.utils.fromWei(userBalance_)) : defaults.userBalance;
        } else {
            return defaults.userBalance;
        }
    };

    /**
     * Gets the pool balances
     * @returns an object containing all the pool balances
     */
    getPoolBalances: () => Promise<{
        target: BigNumber;
        liquidity: BigNumber;
        health: BigNumber;
        buffer: BigNumber;
    }> = async () => {
        const buffer_ = this.instance?.methods.bufferCollateralAmount().call();
        const target_ = this.instance?.methods.getPoolTarget().call();
        const liquidity_ = this.instance?.methods.publicCollateralAmount().call();
        const res = await Promise.all([buffer_, target_, liquidity_]);
        const target = res[1] ? new BigNumber(Web3.utils.fromWei(res[1])) : defaults.target;
        const liquidity = res[2] ? new BigNumber(Web3.utils.fromWei(res[2])) : defaults.liquidity;
        let health = liquidity.div(target).times(100);
        if (!Number.isFinite(health.toNumber()) || Number.isNaN(health.toNumber())) {
            health = defaults.health;
        }
        (this.buffer = res[0] ? new BigNumber(Web3.utils.fromWei(res[0])) : defaults.buffer), (this.target = target);
        this.liquidity = liquidity;
        this.health = health;
        return {
            target: this.target,
            liquidity: this.liquidity,
            health: BigNumber.min(this.health, new BigNumber(100)),
            buffer: this.buffer,
        };
    };
}
