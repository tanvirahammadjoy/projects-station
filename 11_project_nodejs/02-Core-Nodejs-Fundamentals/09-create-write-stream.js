const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST" && req.url === "/upload") {
    const fileStream = fs.createWriteStream("uploaded.txt");

    req.pipe(fileStream); // incoming data piped to file

    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("File uploaded successfully");
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(4000, () => {
  console.log("Upload server at http://localhost:4000");
});
