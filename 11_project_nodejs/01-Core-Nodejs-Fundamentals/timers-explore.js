const {
  setTimeout,
  setImmediate,
  setInterval,
  clearTimeout,
  clearImmediate,
  clearInterval,
} = require("timers");

// Basic timers
const timeout = setTimeout(() => {
  console.log("Timeout executed after 1 second");
}, 1000);

const interval = setInterval(() => {
  console.log("Interval tick");
}, 500);

// Clear after 3 seconds
setTimeout(() => {
  clearInterval(interval);
  console.log("Interval cleared");
}, 3000);

// Immediate execution
const immediate = setImmediate(() => {
  console.log("Immediate executed");
});

// Clear immediate
clearImmediate(immediate);

// Unref and ref
const refTimeout = setTimeout(() => {
  console.log("This will keep process alive");
});

const unrefTimeout = setTimeout(() => {
  console.log("This will not keep process alive");
});
unrefTimeout.unref();

// Promisified timers
const { promisify } = require("util");
const delay = promisify(setTimeout);

async function timedOperation() {
  console.log("Starting operation");
  await delay(2000);
  console.log("Operation completed after delay");
}

timedOperation();
