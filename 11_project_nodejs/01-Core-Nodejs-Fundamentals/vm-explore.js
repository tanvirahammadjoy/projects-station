const vm = require("vm");

// Running simple code
const result = vm.runInNewContext("x + y", { x: 10, y: 20 });
console.log("VM result:", result);

// Creating a context
const context = {
  animal: "cat",
  count: 2,
  console, // Passing console to the VM context
};

vm.createContext(context);

// Running code in the context
vm.runInContext(
  'count += 1; animal += "s"; console.log(`${count} ${animal}`)',
  context
);

// Script compilation
const script = new vm.Script(`
  function add(a, b) {
    return a + b;
  }
  const result = add(x, y);
  result;
`);

const output = script.runInNewContext({ x: 10, y: 20 });
console.log("Script output:", output);

// Timeout example
try {
  vm.runInNewContext("while(true) {}", {}, { timeout: 100 });
} catch (e) {
  console.log("Script timed out:", e.message);
}

// Secure sandbox example
const secureContext = vm.createContext(
  {},
  {
    name: "Secure Sandbox",
    microtaskMode: "afterEvaluate",
    codeGeneration: {
      strings: false,
      wasm: false,
    },
  }
);

try {
  vm.runInContext('new Function("return process")()', secureContext);
} catch (e) {
  console.log("Code generation prevented:", e.message);
}
