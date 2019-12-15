import React from 'react';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import {
  LinearProgress,
  Typography,
} from '@material-ui/core';
import './App.css';
import Error from './components/Error';
import InsuredContracts from './components/InsurecContracts';

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

const CONTRACTS_QUERY = gql`
  query insuredContracts {
    insuredContracts(first: 1000) {
      id
      ens
      covers {
        id
        amount
      }
      stakes {
        id
        amount
      }
    }
  }
`

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Query query={CONTRACTS_QUERY}>
          {({ data, error, loading }) => {
            return loading ? (
              <LinearProgress variant="query" style={{ width: '100%' }} />
            ) : error ? (
              <Error error={error} />
            ) : (
              <InsuredContracts contracts={data.insuredContracts} />
            )
          }}
        </Query>
      </div>
    </ApolloProvider>
  );
}