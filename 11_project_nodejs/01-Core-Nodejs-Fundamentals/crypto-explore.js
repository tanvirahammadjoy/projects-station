const crypto = require("crypto");

// Hashing
const hash = crypto.createHash("sha256");
hash.update("some data to hash");
console.log("SHA-256 Hash:", hash.digest("hex"));

// HMAC
const secret = "my-secret-key";
const hmac = crypto.createHmac("sha256", secret);
hmac.update("some data to hash");
console.log("HMAC:", hmac.digest("hex"));

// Encryption/Decryption
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update("secret message", "utf8", "hex");
encrypted += cipher.final("hex");
console.log("Encrypted:", encrypted);

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
console.log("Decrypted:", decrypted);

// Random values
console.log("Random bytes:", crypto.randomBytes(16).toString("hex"));
