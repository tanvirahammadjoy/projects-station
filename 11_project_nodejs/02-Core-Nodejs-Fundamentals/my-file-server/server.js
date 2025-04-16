const http = require("http");
const fs = require("fs");
const path = require("path");

const publicFolder = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }
  
  // Set CORS headers for all other requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/files") {
    // Read directory and return file list
    fs.readdir(publicFolder, (err, files) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error reading folder");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(files));
    });
    return;
  }

  // Serve files from public folder
  if (req.url.startsWith("/public/")) {
    const filePath = path.join(
      publicFolder,
      decodeURIComponent(req.url.replace("/public/", ""))
    );

    // Stream the file
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        res.end("File not found");
        return;
      }

      const stream = fs.createReadStream(filePath);
      const ext = path.extname(filePath).slice(1);

      const mimeTypes = {
        txt: "text/plain",
        pdf: "application/pdf",
        jpg: "image/jpeg",
        png: "image/png",
      };

      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Content-Disposition":
          "attachment; filename=" + path.basename(filePath),
      });
      stream.pipe(res);
    });
    return;
  }

  // Serve index.html
  if (req.url === "/") {
    fs.readFile("index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
