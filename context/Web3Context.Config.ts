import traderJSON from '@tracer-protocol/contracts/abi/contracts/Trader.sol/Trader.json';
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
    //     previewUrl: '',
    //     contracts: {
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
            trader: {
                address: '0x98D801b0cB3576c048CB74e095187DF5E7025D61',
                abi: traderJSON as AbiItem[],
            },
        },
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-kovan',
    },
    '1337': {
        // local
        previewUrl: '',
        contracts: {
            trader: {
                address: process.env.NEXT_PUBLIC_TRADER_ADDRESS,
                abi: traderJSON as AbiItem[],
            },
        },
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
    },
};
