import React, { useContext } from 'react';
import Client from './client';
export * from './queries';
import { ApolloProvider, useQuery as _useQuery, gql as _gql, ApolloClient } from '@apollo/client';
import { Children } from 'libs/types';
import { Web3Context } from '@context/Web3Context';
import BigNumber from 'bignumber.js';
import { FilledOrder } from 'libs/types/OrderTypes';
import Web3 from 'web3';

type GProps = Children;

const GraphProvider: ({ children }: GProps) => any = ({ children }: GProps) => {
    const { config } = useContext(Web3Context);
    const graphUri = config?.graphUri ?? '';
    const client = Client.ApolloWrapper(graphUri);
    return <ApolloProvider client={client as ApolloClient<any>}>{children}</ApolloProvider>;
};

export default GraphProvider;

export const useGlobalLoadingState = Client.useGlobalLoadingState;
export const useQuery = _useQuery;
export const gql = _gql;

export const toBigNumbers: (orders: any) => FilledOrder[] = (orders) =>
    orders.map((order: any) => ({
        ...order,
        amount: new BigNumber(Web3.utils.fromWei(order.amount)),
        price: new BigNumber(Web3.utils.fromWei(order.price)),
    }));
