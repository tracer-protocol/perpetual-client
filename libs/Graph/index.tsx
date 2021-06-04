import React, { useContext } from 'react';
import Client from './client';
export * from './queries';
import { ApolloProvider, useQuery as _useQuery, gql as _gql, ApolloClient } from '@apollo/client';
import { Children } from 'types';
import { Web3Context } from '@context/Web3Context';
import BigNumber from 'bignumber.js';
import { FilledOrder } from 'types/OrderTypes';
import Web3 from 'web3';

type GProps = Children;

const GraphProvider: ({ children }: GProps) => any = ({ children }: GProps) => {
    const { config } = useContext(Web3Context);
    const client = Client.ApolloWrapper(config?.graphUri ?? '');
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
