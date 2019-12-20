import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import './index.css';
import App from './App';


if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
    throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
  }

const nexusClient = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
})

ReactDOM.render(
    <ApolloProvider client={nexusClient}>
        <App />
    </ApolloProvider>.
     document.getElementById('root')
);
