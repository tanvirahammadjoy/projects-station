const fs = require("fs");

// Synchronous file read
const data = fs.readFileSync("example.txt", "utf8");
console.log("File content:", data);

// Asynchronous file read
fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log("Async file content:", data);
});

// Writing files
fs.writeFileSync("newfile.txt", "Hello Node.js!");
fs.writeFile("newfile-async.txt", "Hello Async!", (err) => {
  if (err) throw err;
  console.log("File written successfully");
});

// Directory operations
if (!fs.existsSync("mydir")) {
  fs.mkdirSync("mydir");
  console.log("Directory created");
}
