const http = require("http");

const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
];

const posts = [
  { id: 1, title: "GraphQL is great", authorId: 1 },
  { id: 2, title: "REST is simple", authorId: 2 },
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/users") {
    res.writeHead(200);
    res.end(JSON.stringify(users));
    return;
  }

  if (req.url === "/posts") {
    res.writeHead(200);
    res.end(JSON.stringify(posts));
    return;
  }

  // Filter posts by user ID (example: /posts?userId=1)
  if (req.url.startsWith("/posts?userId=")) {
    const userId = Number(req.url.split("=")[1]);
    const filtered = posts.filter((post) => post.authorId === userId);
    res.writeHead(200);
    res.end(JSON.stringify(filtered));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log("REST API running at http://localhost:3000");
});
