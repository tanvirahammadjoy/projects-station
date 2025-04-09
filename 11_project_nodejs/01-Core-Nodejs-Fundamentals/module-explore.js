const { Module } = require("module");
const path = require("path");
const fs = require("fs");

// View module paths
console.log("Module paths:", Module._path);

// Create a custom require function
function customRequire(filePath) {
  const resolvedPath = Module._resolveFilename(filePath, null, false);
  const cached = Module._cache[resolvedPath];
  if (cached) return cached.exports;

  const module = new Module(resolvedPath, null);
  Module._cache[resolvedPath] = module;

  try {
    module.load(resolvedPath);
  } catch (err) {
    delete Module._cache[resolvedPath];
    throw err;
  }

  return module.exports;
}

// Test custom require
const myModule = customRequire("./example-module.js");
console.log("Custom require result:", myModule);

// Hook into require
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  console.log(`Requiring: ${id}`);
  return originalRequire.apply(this, arguments);
};

// Now all requires will be logged
require("./example-module.js");

// Reset require
Module.prototype.require = originalRequire;

// Create a module from string
const code = `
  module.exports = {
    greet: function(name) {
      return 'Hello, ' + name + '!';
    },
    answer: 42
  };
`;

const tempModule = new Module("virtual-module");
tempModule._compile(code, "virtual-module.js");
console.log("Virtual module:", tempModule.exports.greet("Node.js"));

// View module wrapper
console.log("Module wrapper:", Module.wrapper);
