const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart worker if needed
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`Hello from worker ${process.pid}\n`);
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
