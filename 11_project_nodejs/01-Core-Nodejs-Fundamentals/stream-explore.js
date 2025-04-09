const fs = require("fs");
const { Transform } = require("stream");

// Readable stream
const readable = fs.createReadStream("example.txt", { encoding: "utf8" });

// Writable stream
const writable = fs.createWriteStream("output.txt");

// Transform stream (both readable and writable)
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// Pipe streams together
readable
  .pipe(upperCaseTransform)
  .pipe(writable)
  .on("finish", () => console.log("Processing complete!"));

// Another example with object mode
const { Readable } = require("stream");
const objectStream = new Readable({
  objectMode: true,
  read() {},
});

objectStream.push({ name: "Alice", age: 30 });
objectStream.push({ name: "Bob", age: 25 });
objectStream.push(null); // No more data

objectStream.on("data", (obj) => console.log("Object:", obj));
