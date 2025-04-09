const tty = require("tty");

// Check if stdin/stdout are TTY
console.log("Is stdin a TTY?", process.stdin.isTTY);
console.log("Is stdout a TTY?", process.stdout.isTTY);

// Get terminal window size
if (process.stdout.isTTY) {
  console.log(
    "Terminal size:",
    process.stdout.columns + "x" + process.stdout.rows
  );
}

// Raw mode example
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  console.log('Enter raw mode (press "q" to quit)');

  process.stdin.on("data", (key) => {
    // Ctrl+C will not work in raw mode
    if (key.toString() === "q") {
      console.log("Exiting raw mode");
      process.stdin.setRawMode(false);
      process.exit();
    }
    console.log("Key pressed:", key.toString(), key);
  });
} else {
  console.log("Not running in a TTY");
}

// Color support check
const supportsColor = require("tty").WriteStream.prototype.hasColors();
console.log("Terminal supports color?", supportsColor);

// Custom TTY formatting
if (process.stdout.isTTY) {
  process.stdout.write("\x1B[36m"); // Cyan text
  process.stdout.write("This is colored text!\n");
  process.stdout.write("\x1B[0m"); // Reset colors
}
