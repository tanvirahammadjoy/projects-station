const buf1 = Buffer.alloc(10); // Creates a zero-filled Buffer of length 10
console.log("Allocated buffer:", buf1);

const buf2 = Buffer.from([1, 2, 3]); // Creates a Buffer from an array
console.log("Array buffer:", buf2);

const buf3 = Buffer.from("Hello Node.js", "utf8"); // Creates a Buffer from a string
console.log("String buffer:", buf3);
console.log("String from buffer:", buf3.toString("utf8"));

// Buffer operations
const bufA = Buffer.from("Hello");
const bufB = Buffer.from(" World");
const bufC = Buffer.concat([bufA, bufB]);
console.log("Concatenated:", bufC.toString());

// Compare buffers
console.log("Comparison:", Buffer.compare(bufA, bufB));

// Copy buffers
const target = Buffer.alloc(10);
bufA.copy(target);
console.log("Copied buffer:", target.toString());

// Buffer and JSON
const bufJson = Buffer.from("JSON example");
const json = JSON.stringify(bufJson);
console.log("JSON:", json);
const parsed = JSON.parse(json);
console.log("Parsed:", Buffer.from(parsed.data).toString());
