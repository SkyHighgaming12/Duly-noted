import Apollo from "apollo-server";
import importAsString from "import-as-string";
import resolvers from "./resolvers.js";
const schema = importAsString("./schema.graphql");

const { ApolloServer } = Apollo;

const server = new ApolloServer({
    resolvers,
    typeDefs: schema
});

server.listen({ port: 3030}).then((result) => {
    console.log(`server listening at ${result.url}`);
});