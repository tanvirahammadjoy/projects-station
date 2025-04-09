const path = require("path");

console.log("Join paths:", path.join("/foo", "bar", "baz/asdf", "quux"));
console.log("Resolve paths:", path.resolve("/foo/bar", "./baz"));
console.log("Extension:", path.extname("index.html"));
console.log("Basename:", path.basename("/foo/bar/baz.html"));
console.log("Dirname:", path.dirname("/foo/bar/baz.html"));
console.log("Parse path:", path.parse("/home/user/dir/file.txt"));
console.log("Normalize path:", path.normalize("/foo/bar//baz/asdf/quux/.."));
