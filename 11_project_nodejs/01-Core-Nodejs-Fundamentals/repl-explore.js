const repl = require("repl");

// Basic REPL server
const basicRepl = repl.start({
  prompt: "Node.js via stdin> ",
  input: process.stdin,
  output: process.stdout,
});

// Custom REPL with context
const customRepl = repl.start({
  prompt: "My App> ",
  useColors: true,
  ignoreUndefined: true,
});

// Add custom commands
customRepl.defineCommand("sayhello", {
  help: "Say hello",
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name || "stranger"}!`);
    this.displayPrompt();
  },
});

// Add custom context
customRepl.context.appVersion = "1.0.0";
customRepl.context.sayHi = () => console.log("Hi from REPL context!");

// REPL server over TCP
const net = require("net");
net
  .createServer((socket) => {
    const remoteRepl = repl
      .start({
        prompt: "Node.js via TCP> ",
        input: socket,
        output: socket,
        terminal: true,
        useGlobal: false,
      })
      .on("exit", () => socket.end());
  })
  .listen(5001);

console.log("TCP REPL server listening on port 5001");
