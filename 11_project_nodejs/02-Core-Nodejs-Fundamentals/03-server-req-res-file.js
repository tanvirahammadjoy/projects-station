const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
  const file = path.join(__dirname, "index.html");
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.log(404);
    } else {
      console.log(data);
    }
  });

  //   console.log("path: ", path.join(__dirname, "inde.html"));
  const parsedUrl = url.parse(req.url, true);
  console.log(`Request received: ${req.method}, url:${req.url},`);
  console.log("Headers:", req.headers);
  console.log("Parsed URL:", parsedUrl);

  const pathname = parsedUrl.pathname;
  console.log("Pathname:", pathname);

  // Convert URL path to file path
  const filePath = path.join(
    __dirname,
    pathname === "/" ? "index.html" : pathname
  );

  // Then serve the file from local system
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
