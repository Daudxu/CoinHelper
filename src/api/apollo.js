import { ApolloClient, InMemoryCache, gql} from '@apollo/client';

export const  connectApolloApi =  (url) => {
    return  new ApolloClient({
        uri: url,
        cache: new InMemoryCache()
    });
}

export const  curveFinanceApi = async (sql) => {
    return connectApolloApi("https://api.thegraph.com/subgraphs/name/messari/curve-finance-ethereum").query({
        query: gql`
          ${sql}
        `,
      })
}