const http = require("http");
const { graphql, buildSchema } = require("graphql");

const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
];

const posts = [
  { id: 1, title: "GraphQL is great", authorId: 1 },
  { id: 2, title: "REST is simple", authorId: 2 },
];

// Define GraphQL schema
const schema = buildSchema(`
  type User {
    id: Int
    name: String
    age: Int
    posts: [Post]
  }

  type Post {
    id: Int
    title: String
    authorId: Int
  }

  type Query {
    users: [User]
    posts: [Post]
  }
`);

// Define resolvers
const root = {
  users: () =>
    users.map((user) => ({
      ...user,
      posts: posts.filter((post) => post.authorId === user.id),
    })),
  posts: () => posts,
};

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle CORS headers for all requests
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://127.0.0.1:5500"
  );

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  // Handle GraphQL requests
  if (req.method === "POST" && req.url === "/graphql") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { query } = JSON.parse(body);
      const result = await graphql({ schema, source: query, rootValue: root });

      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(4000, () => {
  console.log("GraphQL server running at http://localhost:4000/graphql");
});
