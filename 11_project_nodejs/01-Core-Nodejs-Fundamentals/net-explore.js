const net = require("net");

// TCP Server
const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    console.log(`Received: ${data}`);
    socket.write(`Echo: ${data}`);
  });

  socket.on("end", () => console.log("Client disconnected"));
  socket.on("error", (err) => console.error("Socket error:", err));
});

server.listen(8124, () => {
  console.log("TCP server listening on port 8124");
});

// TCP Client
const client = net.createConnection({ port: 8124 }, () => {
  console.log("Connected to server!");
  client.write("Hello from client!");
});

client.on("data", (data) => {
  console.log(`Server says: ${data}`);
  client.end();
});

client.on("end", () => console.log("Disconnected from server"));
