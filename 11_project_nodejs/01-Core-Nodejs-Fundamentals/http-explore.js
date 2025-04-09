const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js HTTP server!\n");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:3000/");
});

// HTTP client example
http
  .get("http://127.0.0.1:3000/", (resp) => {
    let data = "";
    resp.on("data", (chunk) => (data += chunk));
    resp.on("end", () => console.log("Response:", data));
  })
  .on("error", (err) => console.log("Error:", err.message));
