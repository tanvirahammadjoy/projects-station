document.getElementById("user-info").textContent = "...";


// your IndexedDB code goes here
let db;
let request = indexedDB.open("MyDatabase", 2); // ⬅️ version bumped to 2

// ✅ Create store if not exist
request.onupgradeneeded = function (event) {
  db = event.target.result;

  if (!db.objectStoreNames.contains("users")) {
    db.createObjectStore("users", { keyPath: "id" });
    console.log("Object store 'users' created");
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  loadUser(); // Try to show user data on load
};

function loadUser() {
  let tx = db.transaction("users", "readonly");
  let store = tx.objectStore("users");

  let getReq = store.get(1);    // Get user with id 1
  getReq.onsuccess = function () {
    const user = getReq.result;
    if (user) {
      document.getElementById(
        "user-info"
      ).textContent = `Name: ${user.name}, Age: ${user.age}`;
    } else {
      document.getElementById("user-info").textContent = "No user found.";
    }
  };
}

function updateUser() {
  let tx = db.transaction("users", "readwrite");
  let store = tx.objectStore("users");

  // Add
  store.add({ id: 1, name: "John", age: 30 });
  store.add({ id: 2, name: "Jane", age: 25 });
  store.add({ id: 3, name: "Doe", age: 28 });

  // Read
  let getReq = store.get(3);
  getReq.onsuccess = function () {
    console.log("Read User:", getReq.result);
  };

  // Update
  store.put({ id: 1, name: "John Updated", age: 31 });
  store.put({ id: 2, name: "Jane Updated", age: 26 });
  store.put({ id: 3, name: "Doe Updated", age: 29 });

  // Delete (optional – comment this out if you want to *see* updated user)
  // store.delete(1);

  tx.oncomplete = function () {
    console.log("Updated!");
    loadUser();
  };
}
