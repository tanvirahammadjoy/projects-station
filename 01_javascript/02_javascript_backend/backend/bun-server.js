import { serve } from "bun";

serve({
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Hello Ice tea i am bun", { status: 200 });
    } else if (url.pathname === "/ice-tea") {
      return new Response("Ice tea is a good option", { status: 200 });
    } else {
      return new Response("404 Not found", { status: 404 });
    }
  },
  port: 3000,
  hostname: "127.0.0.1",
});

console.log("🚀 Server running at http://localhost:3000");
