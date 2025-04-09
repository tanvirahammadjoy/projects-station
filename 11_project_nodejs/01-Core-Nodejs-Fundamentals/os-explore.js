const os = require("os");

console.log("Platform:", os.platform());
console.log("Architecture:", os.arch());
console.log("CPU Cores:", os.cpus().length);
console.log("Free Memory:", os.freemem() / (1024 * 1024), "MB");
console.log("Total Memory:", os.totalmem() / (1024 * 1024), "MB");
console.log("Home Directory:", os.homedir());
console.log("Uptime:", os.uptime(), "seconds");
console.log("Network Interfaces:", os.networkInterfaces());
console.log("User Info:", os.userInfo());
