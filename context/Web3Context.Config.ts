import factoryJSON from '@tracer-protocol/contracts/build/contracts/TracerFactory.json';
import accountJSON from '@tracer-protocol/contracts/build/contracts/Account.json';
import oracleJSON from '@tracer-protocol/contracts/build/contracts/Oracle.json';
import insuranceJSON from '@tracer-protocol/contracts/build/contracts/Insurance.json';
import pricingJSON from '@tracer-protocol/contracts/build/contracts/Pricing.json';
import traderJSON from '@tracer-protocol/contracts/build/contracts/Trader.json';
import { AbiItem } from 'web3-utils';

export type Network = {
    previewUrl: string;
    contracts: {
        [name: string]: {
            address: string | undefined;
            abi: AbiItem[];
        };
    };
    graphUri: string;
};

export const networkConfig: Record<string, Network> = {
    // '1': {
    //     // local
    //     previewUrl: '',
    //     contracts: {
    //         factory: {
    //             address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
    //             abi: factoryJSON.abi as AbiItem[],
    //         },
    //         insurance: {
    //             address: process.env.NEXT_PUBLIC_INSURANCE_ADDRESS,
    //             abi: insuranceJSON.abi as AbiItem[],
    //         },
    //         account: {
    //             address: process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS,
    //             abi: accountJSON.abi as AbiItem[],
    //         },
    //         pricing: {
    //             address: process.env.NEXT_PUBLIC_PRICING_ADDRESS,
    //             abi: pricingJSON.abi as AbiItem[],
    //         },
    //         oracle: {
    //             address: process.env.NEXT_PUBLIC_ORACLE_ADDRESS,
    //             abi: oracleJSON.abi as AbiItem[],
    //         },
    //     },
    //     graphUri: 'http://localhost:8000/subgraphs/name/tetther1122/tracer-graph',
    // },
    // other networks go here
    '42': {
        previewUrl: 'https://kovan.etherscan.io',
        contracts: {
            factory: {
                address: '0xB0577B9A46c555eA0B35d35903823ECC70aE0998',
                abi: factoryJSON.abi as AbiItem[],
            },
            insurance: {
                address: '0x8a2c78De0c31C8C0C0B1Eb0f55245D9Fbee82734',
                abi: insuranceJSON.abi as AbiItem[],
            },
            account: {
                address: '0xf50B2b84E0B607D4922F5117EfDaE22Edb1a9aA0',
                abi: accountJSON.abi as AbiItem[],
            },
            pricing: {
                address: '0x238987aE4EC0a4C7B38816E8e2d5aA7D2dE47A61',
                abi: pricingJSON.abi as AbiItem[],
            },
            oracle: {
                address: '0x783D398923277aFC2dF89F92afA6af58EFd1BB45',
                abi: oracleJSON.abi as AbiItem[],
            },
            trader: {
                address: "0x636EfC1dB64F64664ca7AD83946E6Cb2C9F16313",
                abi: traderJSON.abi as AbiItem[],
            },
        },
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-kovan',
    },
    '1337': {
        // local
        previewUrl: '',
        contracts: {
            factory: {
                address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
                abi: factoryJSON.abi as AbiItem[],
            },
            insurance: {
                address: process.env.NEXT_PUBLIC_INSURANCE_ADDRESS,
                abi: insuranceJSON.abi as AbiItem[],
            },
            account: {
                address: process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS,
                abi: accountJSON.abi as AbiItem[],
            },
            pricing: {
                address: process.env.NEXT_PUBLIC_PRICING_ADDRESS,
                abi: pricingJSON.abi as AbiItem[],
            },
            oracle: {
                address: process.env.NEXT_PUBLIC_ORACLE_ADDRESS,
                abi: oracleJSON.abi as AbiItem[],
            },
            trader: {
                address: process.env.NEXT_PUBLIC_TRADER_ADDRESS,
                abi: traderJSON.abi as AbiItem[],
            },
        },
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
    },
    // other networks go here
};
