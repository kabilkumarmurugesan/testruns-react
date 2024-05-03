import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { handleLogouFunction } from './common-services';
import { auth } from '../firebase.config';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = window.sessionStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const GraphqlInstance = {
  async query(gql: any, payload: any) {
    try {
      const response = await client.query({
        query: gql,
        variables: payload,
        fetchPolicy: 'network-only',
      });
      return response;
    } catch (error: any) {
      if (
        error.graphQLErrors[0] &&
        error.graphQLErrors[0].message.includes('Invalid Token')
        // error.graphQLErrors[0].extensions.exception.code === 401
      ) {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const idTokenResult = await currentUser.getIdTokenResult();
            window.sessionStorage.setItem('accessToken', idTokenResult.token);
          } else {
            handleLogouFunction('Token is expired');
          }
        } catch (error) {
          handleLogouFunction('Token is expired');
          console.error(error);
        }
      }
      return error;
    }
  },
  async mutation(gql: any, payload: any) {
    try {
      const response = await client.mutate({
        mutation: gql,
        variables: payload,
        fetchPolicy: 'network-only',
      });

      return response;
    } catch (error: any) {
      if (
        error.graphQLErrors[0] &&
        error.graphQLErrors[0].message.includes('Invalid Token')
        // error.graphQLErrors[0].extensions.exception.code === 401
      ) {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const idTokenResult = await currentUser.getIdTokenResult();
            window.sessionStorage.setItem('accessToken', idTokenResult.token);
          } else {
            handleLogouFunction('Token is expired');
          }
        } catch (error) {
          handleLogouFunction('Token is expired');
          console.error(error);
        }
      }
      return error;
    }
  },
};
