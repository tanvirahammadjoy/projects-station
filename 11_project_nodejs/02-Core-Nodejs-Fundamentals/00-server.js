const http = require("http");
const url = require("url");
const crypto = require("crypto");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const cryp = crypto.randomBytes(16).toString("hex");
  console.log(cryp);
  
  console.log(`Request received: ${req.method}, url:${req.url},`);
  console.log("Headers:", req.headers);

  const hash = url.parse(req.url, true);
  console.log("Hash:", hash);

  const query = url.parse(req.url, true).query;
  const pathname = url.parse(req.url).pathname;
  console.log("Query Parameters:", query, "Pathname:", pathname);

  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
  } else if (req.method === "GET" && req.url === "/about") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("About Page\n");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
