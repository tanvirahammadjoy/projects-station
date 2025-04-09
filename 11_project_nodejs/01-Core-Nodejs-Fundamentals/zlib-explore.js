const zlib = require("zlib");
const fs = require("fs");

// Gzip compression
const gzip = zlib.createGzip();
const input = fs.createReadStream("example.txt");
const output = fs.createWriteStream("example.txt.gz");

input
  .pipe(gzip)
  .pipe(output)
  .on("finish", () => console.log("File compressed"));

// Gunzip decompression
const gunzip = zlib.createGunzip();
const compressed = fs.createReadStream("example.txt.gz");
const decompressed = fs.createWriteStream("example-decompressed.txt");

compressed
  .pipe(gunzip)
  .pipe(decompressed)
  .on("finish", () => console.log("File decompressed"));

// Deflate/Inflate
const data = Buffer.from("This is some data to compress", "utf8");

zlib.deflate(data, (err, compressed) => {
  if (err) throw err;
  console.log("Deflated size:", compressed.length);

  zlib.inflate(compressed, (err, original) => {
    if (err) throw err;
    console.log("Inflated data:", original.toString());
  });
});

// Compression levels
const highCompression = zlib.createDeflate({
  level: zlib.constants.Z_BEST_COMPRESSION,
});
const fastCompression = zlib.createDeflate({
  level: zlib.constants.Z_BEST_SPEED,
});

// Brotli compression (Node.js 10+)
if (zlib.brotliCompress) {
  zlib.brotliCompress(data, (err, compressed) => {
    if (err) throw err;
    console.log("Brotli compressed size:", compressed.length);
  });
}
