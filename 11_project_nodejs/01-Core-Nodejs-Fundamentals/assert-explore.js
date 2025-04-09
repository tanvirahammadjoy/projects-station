const assert = require("assert");

// Basic assertions
assert.strictEqual(1, 1, "Numbers should be strictly equal");
assert.notStrictEqual(1, "1", "Number and string not strictly equal");

// Deep equality
assert.deepStrictEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 2 } },
  "Objects should be deeply equal"
);

// Error checking
assert.throws(
  () => {
    throw new Error("Wrong value");
  },
  Error,
  "Should throw an error"
);

// Promise assertions (Node.js 10+)
assert.rejects(
  Promise.reject(new Error("Failed")),
  Error,
  "Promise should be rejected"
);

assert.doesNotReject(Promise.resolve(42), "Promise should resolve");

// Custom error messages
const value = 10;
assert(value > 5, `Value ${value} should be greater than 5`);

// Assertion tracking
console.log("\nAssertion tracking:");
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func, 2);

callsfunc();
callsfunc();

// process.nextTick(() => {
//   callsfunc(); // This would throw an error
// });

tracker.verify(); // Verifies all tracked functions were called the right number of times
