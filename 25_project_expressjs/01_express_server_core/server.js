const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/home", (req, res) => {
  console.log("home page"); // log to console
  res.send("Welcome to the home page!"); // response for home page
});

app.get("/user/:id", (req, res) => {
  console.log(req.params.id); // dynamic part of the URL
  // res.json({ message: "Success" }); // JSON response
  // res.redirect("/home");
  res.status(200)
  res.set("X-Powered-By", "Ali's Engine").send("Header set");
  // res.send("Hello from server!"); // plain text
});

// we can not send multiple types of responses from singal route
app.get("/about", (req, res) => {
  res.send("About page"); // plain text
  res.json({ message: "Success" }); // JSON response
  res.redirect("/home");
  res.set("X-Powered-By", "Ali's Engine").send("Header set");
  res.status(400).send("Bad request");
  res.send("Hello from server!"); // plain text
});

// err after first response
app.get("/search", (req, res) => {
  console.log(req.query.q); // search query
  res.json({ message: "Success" }); // JSON response
  res.redirect("/home");
  res.set("X-Powered-By", "Ali's Engine").send("Header set");
  res.status(400).send("Bad request");
  res.send("Hello from server!"); // plain text
});

// err after first response
app.post("/login", (req, res) => {
  console.log(req.body.username); // from form or JSON body
  res.json({ message: "Success" }); // JSON response
  res.redirect("/home");
  res.set("X-Powered-By", "Ali's Engine").send("Header set");
  res.status(400).send("Bad request");
  res.send("Hello from server!"); // plain text
});

app.get("/private", (req, res) => {
  // middleware to check authentication
  if (!req.query.token) {
    return res.status(401).send("Unauthorized");
  }
  res.send("Welcome to the private page!");
});

// dashboard route with role-based access
app.get("/dashboard", (req, res) => { // corrected route name
  if (req.query.role == "admin") {
    console.log("admin");
    return res.send("Welcome to the admin dashboard!");
  } else if (req.query.role == "user") {
    console.log("user");
    return res.send("Welcome to the user dashboard!");
  } else {
    console.log("forbidden");
    return res.status(403).send("Forbidden");
  }
});

app.get("/custom-header", (req, res) => {
  res.set("X-Powered-By", "Ali's Engine").send("This has a custom header!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
