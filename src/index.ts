// Import the framework and instantiate it
import fastify from 'fastify'
import fastifyIO from "fastify-socket.io";
import {Server} from "socket.io";

const server = fastify();
server.register(fastifyIO);

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
server.listen({ port: 3000 }).catch((err) => {
    server.log.error(err)
    process.exit(1)
})

declare module "fastify" {
    interface FastifyInstance {
        io: Server;
    }
}