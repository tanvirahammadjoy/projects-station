// userStore.js
const users = [];
console.log("User store initialized");
console.log("Users array:", users);

function addUser(username, password) {
  users.push({ username, password });
  console.log("User added:", { username, password });
  console.log("Current users:", users);
}

function findUser(username) {
  console.log("Finding user:", username);
  const user = users.find((u) => u.username === username);
  console.log("Found user:", user);
  return user;
}

module.exports = { addUser, findUser };
