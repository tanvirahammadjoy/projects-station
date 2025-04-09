const inspector = require("inspector");
const fs = require("fs");
const session = new inspector.Session();

// Start inspector
inspector.open(9229, "0.0.0.0", true);
console.log("Inspector is available at http://localhost:9229");

// Connect session
session.connect();

// CPU profiling
function startProfiling() {
  session.post("Profiler.enable", () => {
    session.post("Profiler.start", () => {
      console.log("Profiling started...");

      // Do some CPU-intensive work
      let sum = 0;
      for (let i = 0; i < 100000000; i++) {
        sum += Math.random();
      }

      session.post("Profiler.stop", (err, { profile }) => {
        if (err) throw err;
        fs.writeFileSync("./profile.cpuprofile", JSON.stringify(profile));
        console.log("CPU profile written to profile.cpuprofile");
      });
    });
  });
}

// Heap snapshot
function takeHeapSnapshot() {
  session.post("HeapProfiler.enable", () => {
    session.post(
      "HeapProfiler.takeHeapSnapshot",
      null,
      (err, { snapshotData }) => {
        if (err) throw err;
        fs.writeFileSync("./heapsnapshot.heapsnapshot", snapshotData);
        console.log("Heap snapshot written to heapsnapshot.heapsnapshot");
      }
    );
  });
}

// Memory sampling
function startMemorySampling() {
  session.post("HeapProfiler.startSampling", {
    samplingInterval: 16384,
  });

  setTimeout(() => {
    session.post("HeapProfiler.stopSampling", (err, { profile }) => {
      if (err) throw err;
      fs.writeFileSync("./memory-profile.heapprofile", JSON.stringify(profile));
      console.log("Memory profile written to memory-profile.heapprofile");
    });
  }, 5000);
}

// Uncomment to run different debugging operations
// startProfiling();
// takeHeapSnapshot();
// startMemorySampling();
