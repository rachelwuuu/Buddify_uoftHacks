import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: "http://Buddify.online/graphql",
    cache: new InMemoryCache()
})