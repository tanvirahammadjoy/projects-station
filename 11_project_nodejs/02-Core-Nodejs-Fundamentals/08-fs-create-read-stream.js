const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/file") {
    const filePath = path.join(__dirname, "sample.txt");

    const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });

    res.writeHead(200, {
      "Content-Type": "text/plain",
    });

    // Pipe the file to response
    readStream.pipe(res);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
