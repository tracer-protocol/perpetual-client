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
/**
 * Network store which allows swapping between networks and fetching from different data sources.
 * Keys are the ID of the network.
 * The 0 network is a default network when the user has not connected their address.
 *  The data sources for the 0 network are populated from the env variables.
 * The local config also uses the ENV variables so the commit history is not riddled with updates to
 *  this config.
 * Do not change the other network configs unless the contract addresses have changed.
 */
export const networkConfig: Record<string, Network> = {
    '0': {
        previewUrl: '',
        contracts: {
            trader: {
                address: process.env.NEXT_PUBLIC_TRADER_ADDRESS,
                abi: traderJSON as AbiItem[],
            },
        },
        graphUri: process.env.NEXT_PUBLIC_GRAPH_URI ?? '',
    },
    '421611': {
        // arbitrum
        previewUrl: 'https://rinkeby-explorer.arbitrum.io/#',
        contracts: {
            trader: {
                address: '0xb6fEb22261c7cf27B7cc031f78575eCEE0778E48',
                abi: traderJSON as AbiItem[],
            },
        },
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
    },
    '42': {
        previewUrl: 'https://kovan.etherscan.io',
        contracts: {
            trader: {
                address: '0xFab8d76696Db31461C0998096da505440c36Ad21',
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
