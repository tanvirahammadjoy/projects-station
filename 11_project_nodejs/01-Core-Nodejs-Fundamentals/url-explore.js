const url = require("url");
const { URL, URLSearchParams } = require("url");

// Legacy URL parsing
const parsedUrl = url.parse("https://example.com:8080/path?query=string#hash");
console.log("Parsed URL:", parsedUrl);

// WHATWG URL API
const myURL = new URL("https://example.org:8080/foo/bar?q=baz#section");
console.log("WHATWG URL:", {
  href: myURL.href,
  origin: myURL.origin,
  protocol: myURL.protocol,
  host: myURL.host,
  hostname: myURL.hostname,
  port: myURL.port,
  pathname: myURL.pathname,
  search: myURL.search,
  hash: myURL.hash,
});

// URLSearchParams
const params = new URLSearchParams(myURL.search);
params.append("new", "param");
console.log("Search params:", params.toString());
console.log('Get "q" param:', params.get("q"));
console.log('Has "q" param:', params.has("q"));
params.forEach((value, name) => console.log(`${name}: ${value}`));

// Formatting
console.log(
  "Formatted URL:",
  url.format({
    protocol: "https",
    hostname: "example.com",
    pathname: "/some/path",
    query: { q: "search" },
  })
);
