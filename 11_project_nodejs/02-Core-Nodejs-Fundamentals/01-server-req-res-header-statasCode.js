const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Home Page</h1>");
    res.end("Welcome to our home page");
    return;
  }
  if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("<h1>About Page</h1>");
    res.end("Here is our short history");
    return;
  }
  if (req.url === "/contact") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write("<h1>Contact Page</h1>");
    res.write("<h1>Contact Page</h1>");
    res.end("Contact us at 000000000000");
    return;
  }

  // Default fallback response
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end(`
    <h1>Oops!</h1>
    <p>We can't seem to find the page you are looking for</p>
    <a href="/">back home</a>
    `);
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000...");
  console.log("Server is running at http://localhost:5000");
});
