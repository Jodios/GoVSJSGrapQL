import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { typeDefs } from "./typeDefs.js";
import pokeResolver from "./resolvers/pokeresolver.js";
import dotenv from "dotenv";
import { init } from "./db/firestore.js";
import express from "express";
import promClient from "prom-client";
import http from 'http';
dotenv.config();
init();

export const httpRequestTimer = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const collectDefaultMetrics = promClient.collectDefaultMetrics;
const register = new promClient.Registry()
register.registerMetric(httpRequestTimer);
collectDefaultMetrics({register});

const app = express();
const httpServer = http.createServer(app);

app.get("/metrics", async (req,res) => {
    const end = httpRequestTimer.startTimer();
    res.setHeader('Content-Type', register.contentType)
    res.send(await register.metrics());
    end({
        route: req.route.path,
        code: res.statusCode, 
        method: req.method
    });
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