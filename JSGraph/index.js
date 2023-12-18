import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { typeDefs } from "./typeDefs.js";
import pokeResolver from "./resolvers/pokeresolver.js";
import dotenv from "dotenv";
import { init } from "./db/firestore.js";
import express from "express";
import promClient, { register } from "prom-client";
import http from 'http';
dotenv.config();
init();

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({
    prefix: "jsgraph"
});

const app = express();
const httpServer = http.createServer(app);

app.get("/metrics", async (req,res) => {
    const metrics = await register.metrics();
    res.send(metrics);
});

const resolvers = {
    Query: {
        Pokemon: pokeResolver
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});


await server.start(); 
server.applyMiddleware({
    app,
    path: '/graphql'
});

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);