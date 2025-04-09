const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toUpperCase();
  const query = parsedUrl.query;

  // Remove leading/trailing slashes
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Route handlers
  const routes = {
    hello: {
      GET: (data, callback) => {
        callback(200, { message: "Hello World!" });
      },
      POST: (data, callback) => {
        callback(201, { message: `Hello ${data.payload.name || "Stranger"}!` });
      },
    },
    users: {
      GET: (data, callback) => {
        callback(200, [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" },
        ]);
      },
    },
  };

  // Handle CORS preflight requests (OPTIONS method)
  if (method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  // Choose the handler
  const routeHandler = routes[trimmedPath] ? routes[trimmedPath][method] : null;

  // Collect payload if POST/PUT
  if (method === "POST" || method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        handleRequest(routeHandler, payload);
      } catch (e) {
        sendResponse(res, 400, { error: "Invalid JSON" });
      }
    });
  } else {
    handleRequest(routeHandler, {});
  }

  function handleRequest(handler, payload) {
    const data = {
      path: trimmedPath,
      query,
      method,
      payload,
    };

    if (typeof handler === "function") {
      handler(data, (statusCode, response) => {
        sendResponse(res, statusCode, response);
      });
    } else {
      sendResponse(res, 404, { error: "Not Found" });
    }
  }

  function sendResponse(res, statusCode, response) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Set content type
    res.setHeader("Content-Type", "application/json");

    // Send response
    res.writeHead(statusCode);
    res.end(JSON.stringify(response));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
