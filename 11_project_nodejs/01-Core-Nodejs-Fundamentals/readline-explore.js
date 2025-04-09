const readline = require("readline");

// Simple interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", (name) => {
  console.log(`Hello, ${name}!`);
  rl.close();
});

// More complex example
const complexRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

let counter = 0;

function askQuestion() {
  complexRl.question(`Enter something (${counter + 1}/3): `, (answer) => {
    console.log(`You entered: ${answer}`);
    counter++;

    if (counter < 3) {
      askQuestion();
    } else {
      console.log("Thank you for your answers!");
      complexRl.close();
    }
  });
}

askQuestion();

// Password input (hidden)
const hiddenRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

hiddenRl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (stringToWrite === "Password: ") {
    hiddenRl.output.write(stringToWrite);
  } else {
    hiddenRl.output.write("*");
  }
};

hiddenRl.question("Password: ", (password) => {
  console.log("\nYour password is:", password.replace(/./g, "*"));
  hiddenRl.close();
});
