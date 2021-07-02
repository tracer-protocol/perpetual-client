import BigNumber from "bignumber.js";
import Web3 from "web3";
import insuranceAbi from '@tracer-protocol/contracts/abi/contracts/Insurance.sol/Insurance.json';
import { AbiItem } from 'web3-utils';
import {
    Insurance as InsuranceType,
} from '@tracer-protocol/contracts/types/Insurance';

export const defaults: Record<string, any> = {
    userBalance: new BigNumber(0),
    target: new BigNumber(0),
    liquidity: new BigNumber(0),
    rewards: new BigNumber(0),
    health: new BigNumber(0),
    apy: new BigNumber(0),
    buffer: new BigNumber(0),
	iTokenAddress: ''
};

export default class Insurance {
    instance: InsuranceType;
	address: string;
    market: string;
    liquidity: BigNumber;
    target: BigNumber;
    userBalance: BigNumber;
    rewards: BigNumber;
    health: BigNumber;
    apy: BigNumber;
    buffer: BigNumber;
    iTokenAddress: string;
    iPoolTokenName: string;
	initialised: Promise<boolean>;

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


	init: () => Promise<boolean> = async () => {
		try {
			const iTokenAddress = await this.instance?.methods.token().call();
			this.iTokenAddress = iTokenAddress;
			await this.updatePoolBalance()
			return true;
		} catch (err) {
			console.error('Failed to init insurance contract', err)
			return false;
		}
	}

	getUserBalance: (account: string) => Promise<BigNumber> = async (account) => {
		if (account) {
			const userBalance_ = await this.instance?.methods.getPoolUserBalance(account as string).call()
			return userBalance_ ? new BigNumber(Web3.utils.fromWei(userBalance_)) : defaults.userBalance;
		}
	}

	updatePoolBalance: () => Promise<void> = async () => {
		const buffer_ = this.instance?.methods.bufferCollateralAmount().call();
		const target_ = this.instance?.methods.getPoolTarget().call();
		const liquidity_ = this.instance?.methods.publicCollateralAmount().call();
		const res = await Promise.all([buffer_, target_, liquidity_])
		const target = res[1] ? new BigNumber(Web3.utils.fromWei(res[1])) : defaults.target;
		const liquidity = res[2] ? new BigNumber(Web3.utils.fromWei(res[2])) : defaults.liquidity;
		let health = liquidity.div(target).times(100);
		if (!Number.isFinite(health.toNumber()) || Number.isNaN(health.toNumber())) {
			health = defaults.health;
		}
		this.buffer = res[0] ? new BigNumber(Web3.utils.fromWei(res[0])) : defaults.buffer,
		this.target = target;
		this.liquidity = liquidity;
		this.health = health;
	}

	getPoolBalances: () => {
		target: BigNumber,
		liquidity: BigNumber,
		health: BigNumber,
		buffer: BigNumber
	} = () => {
		console.log(this.health.toNumber())
		return ({
			target: this.target,
			liquidity: this.liquidity,
			health: BigNumber.min(this.health, new BigNumber(100)),
			buffer: this.buffer
		})

	}
}