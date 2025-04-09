const querystring = require("querystring");

// Parse query string
const parsed = querystring.parse(
  "name=John&age=30&hobbies=music&hobbies=sports"
);
console.log("Parsed query:", parsed);

// Stringify object to query string
const stringified = querystring.stringify({
  name: "Jane",
  age: "25",
  skills: ["js", "node"],
});
console.log("Stringified query:", stringified);

// Escape and unescape
const escaped = querystring.escape("Hello World!@#$");
console.log("Escaped:", escaped);
console.log("Unescaped:", querystring.unescape(escaped));

// Custom delimiters
const customParsed = querystring.parse("name-John|age-30", "|", "-");
console.log("Custom parsed:", customParsed);
