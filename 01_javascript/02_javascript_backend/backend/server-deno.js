// server.js
import { serve } from "https://deno.land/std@0.214.0/http/server.ts";
// import { serve } from "deno";

function handler(req) {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response("Welcome to the Home Page");
  } else if (url.pathname === "/about") {
    return new Response("This is the About Page");
  } else if (url.pathname === "/api") {
    const data = { message: "Hello from API!", success: true };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response("404 Not Found", { status: 404 });
  }
}

console.log("🚀 Server running at http://localhost:8000");
serve(handler, { port: 8000 });
