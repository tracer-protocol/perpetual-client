import React from 'react';
import Client from './client';
import { ApolloProvider, useQuery as _useQuery, gql as _gql, ApolloClient } from '@apollo/client';
import { Children } from 'libs/types';
import { useWeb3 } from '@context/Web3Context/Web3Context';

type GProps = Children;

/** Graph Provider wrapper. Uses the Web3Contexts config based on the connected network */
const GraphProvider: ({ children }: GProps) => any = ({ children }: GProps) => {
    const { config } = useWeb3();
    const graphUri = config?.graphUri ?? '';
    const client = Client.ApolloWrapper(graphUri);
    return <ApolloProvider client={client as ApolloClient<any>}>{children}</ApolloProvider>;
};

export default GraphProvider;

export const useGlobalLoadingState = Client.useGlobalLoadingState;
export const useQuery = _useQuery;
export const gql = _gql;
