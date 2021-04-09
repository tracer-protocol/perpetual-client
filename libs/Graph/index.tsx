import React from 'react';
import Client from './client';
export * from './queries';
import { ApolloProvider, useQuery as _useQuery, gql as _gql, ApolloClient } from '@apollo/client';
import { Children } from 'types';

type GProps = {
    graphUri: string;
} & Children;

const GraphProvider: ({ graphUri, children }: GProps) => any = ({ graphUri, children }: GProps) => {
    const client = Client.ApolloWrapper(graphUri);
    return <ApolloProvider client={client as ApolloClient<any>}>{children}</ApolloProvider>;
};

export default GraphProvider;

export const useGlobalLoadingState = Client.useGlobalLoadingState;
export const useQuery = _useQuery;
export const gql = _gql;
