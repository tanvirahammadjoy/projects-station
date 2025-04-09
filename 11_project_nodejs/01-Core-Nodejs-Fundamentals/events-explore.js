const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("event", () => console.log("Event occurred!"));
myEmitter.emit("event");

// With parameters
myEmitter.on("data", (data) => console.log("Data received:", data));
myEmitter.emit("data", { id: 1, name: "Node.js" });

// Once - only triggers once
myEmitter.once("once", () => console.log("This will only fire once"));
myEmitter.emit("once");
myEmitter.emit("once"); // Won't fire

// Error handling
myEmitter.on("error", (err) => console.error("Error:", err.message));
myEmitter.emit("error", new Error("Something went wrong"));
