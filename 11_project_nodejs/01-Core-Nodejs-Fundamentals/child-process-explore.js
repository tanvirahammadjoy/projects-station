const { exec, spawn, fork } = require("child_process");

// exec - simple command execution
exec("ls -lh", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log("exec stdout:\n", stdout);
  console.error("exec stderr:", stderr);
});

// spawn - more control over the process
const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => console.log(`spawn stdout:\n${data}`));
ls.stderr.on("data", (data) => console.error(`spawn stderr: ${data}`));
ls.on("close", (code) => console.log(`spawn process exited with code ${code}`));

// fork - special case of spawn for Node processes
if (process.argv[2] === "child") {
  console.log("Child process running");
  process.send({ hello: "from child" });
  process.on("message", (m) => console.log("Child got message:", m));
} else {
  const child = fork(__filename, ["child"]);
  child.on("message", (m) => {
    console.log("Parent got message:", m);
    child.send({ hello: "from parent" });
  });
}
