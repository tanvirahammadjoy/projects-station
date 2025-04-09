const dns = require("dns");

// Lookup hostname
dns.lookup("google.com", (err, address, family) => {
  console.log("Lookup address:", address, "IPv", family);
});

// Resolve hostname (more DNS records)
dns.resolve4("google.com", (err, addresses) => {
  console.log("IPv4 addresses:", addresses);
});

dns.resolveMx("google.com", (err, records) => {
  console.log("MX records:", records);
});

// Reverse DNS lookup
dns.reverse("8.8.8.8", (err, hostnames) => {
  console.log("Reverse lookup for 8.8.8.8:", hostnames);
});

// Promisified version
const { promisify } = require("util");
const resolve4Async = promisify(dns.resolve4);

async function lookupDomain(domain) {
  try {
    const addresses = await resolve4Async(domain);
    console.log(`Async addresses for ${domain}:`, addresses);
  } catch (err) {
    console.error(`Error looking up ${domain}:`, err);
  }
}

lookupDomain("nodejs.org");
