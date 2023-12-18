import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./typeDefs.js";
import pokeResolver from "./resolvers/pokeresolver.js";
import dotenv from "dotenv";
import { init } from "./db/firestore.js";
dotenv.config();
init();

const resolvers = {
    Query: {
        Pokemon: pokeResolver
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});


const { url } = await startStandaloneServer(server); 
console.log(`Server ready at: ${url}`)