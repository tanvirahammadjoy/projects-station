const util = require("util");

// Promisify callback-based functions
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

readFile("example.txt", "utf8")
  .then((data) => console.log("File content (promisified):", data))
  .catch((err) => console.error("Error:", err));

// Inspect objects
const obj = {
  name: "Node.js",
  version: process.version,
  nested: { array: [1, 2, 3] },
};
console.log(util.inspect(obj, { colors: true, depth: null }));

// Format strings
console.log(util.format("%s:%s", "foo", "bar", "baz")); // 'foo:bar baz'

// Inheritance
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(`${this.name} makes a noise.`);
};

function Dog(name) {
  Animal.call(this, name);
}
util.inherits(Dog, Animal);
Dog.prototype.speak = function () {
  console.log(`${this.name} barks.`);
};

const d = new Dog("Rex");
d.speak();
