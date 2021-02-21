import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: "http://localhost:3000/graphql",
    // uri: "http://Buddify.online/graphql",
    cache: new InMemoryCache()
})