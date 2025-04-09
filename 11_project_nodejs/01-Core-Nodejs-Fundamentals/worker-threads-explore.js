const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");

if (isMainThread) {
  // Main thread code
  console.log("Main thread started");

  // Create a worker
  const worker = new Worker(__filename, {
    workerData: {
      value: 10,
      array: [1, 2, 3],
    },
  });

  // Receive messages from worker
  worker.on("message", (result) => {
    console.log("Result from worker:", result);
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });

  // Send message to worker
  worker.postMessage("Calculate factorial!");
} else {
  // Worker thread code
  console.log("Worker thread started with data:", workerData);

  // Process received from main thread
  parentPort.on("message", (msg) => {
    console.log("Message from main thread:", msg);

    // Do CPU-intensive work
    const result = factorial(workerData.value);

    // Send result back
    parentPort.postMessage({
      input: workerData.value,
      result,
      modifiedArray: workerData.array.map((x) => x * 2),
    });
  });

  // Example CPU-intensive function
  function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
  }
}

// SharedArrayBuffer example
function sharedBufferExample() {
  const { Worker } = require("worker_threads");
  const sharedBuffer = new SharedArrayBuffer(4);
  const array = new Int32Array(sharedBuffer);

  const worker = new Worker(
    `
    const { workerData, parentPort } = require('worker_threads');
    const array = new Int32Array(workerData);
    Atomics.add(array, 0, 5);
    parentPort.postMessage('Done');
  `,
    { eval: true, workerData: sharedBuffer }
  );

  worker.on("message", () => {
    console.log("Shared array value:", array[0]);
  });
}

// Uncomment to run shared buffer example
// sharedBufferExample();
