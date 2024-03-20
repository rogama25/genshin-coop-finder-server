// Import the framework and instantiate it
import fastify from 'fastify'
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import cors from "@fastify/cors"

const server = fastify();
server.register(fastifyIO, {
    cors: {
        origin: "http://localhost:3000"
    }
});
server.register(cors, {
    "origin": "http://localhost:3000"
})

server.get("/", (req, reply) => {
    server.io.emit("hello", 1);
});

server.ready().then(() => {
    // we need to wait for the server to be ready, else `server.io` is undefined
    server.io.on("connection", (socket) => {
        console.log(socket.id + ": connected");
        socket.emit("hello", 2)

        socket.on("disconnect", () => {
            console.log(socket.id + ": disconnected from socket");
        })
        // ...
    });
});

// Run the server!
server.listen({ port: 3500 }).then(() => {
    console.log("Server started, listening")
}).catch((err) => {
    console.error(err)
    process.exit(1)
})

declare module "fastify" {
    interface FastifyInstance {
        io: Server;
    }
}