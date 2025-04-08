import express from "express";
const app = express();
const port = 3000;
import path from "path";
import { fileURLToPath } from "url";
import { log } from "console";
log(`path: ${path}`);
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
log(`__filename: ${__filename}`);
const __dirname = path.dirname(__filename);
log(`__dirname: ${__dirname}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use("/static", express.static(path.join(__dirname, "static", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "public", "hello.html"));
});

app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "public", "form.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  console.log(req.body.email);
  console.log(req.body.name);
  // console.log(req.body.number);
  console.log(req.file);
  res.send(
    `User data received: ${JSON.stringify(req.body)}, file: ${JSON.stringify(
      req.file
    )}`
  );
});

// how to handle meadia
const uploadFolder = path.join(__dirname, "uploads");

// Set up custom storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // This is your custom path
  },
  filename: function (req, file, cb) {
    // Keep the original name or use a custom one
    cb(null, Date.now() + file.originalname + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// app.post("/upload", upload.single("img"), (req, res) => {
//   // req.file is the `img` file
//   console.log(req.file);
//   console.log(req.body);
//   res.send({ message: "File uploaded successfully", file: req.file, body: req.body });
// });

app.post("/upload", upload.array("img", 3), (req, res) => {
  // req.file is the `img` file
  console.log(req.files);
  console.log(req.body);
  res.send({
    message: "Files uploaded successfully",
    files: req.files,
    body: req.body,
  });
});

// get data from the url like this: http://localhost:3000/user/1
// get data from the url like this: http://localhost:3000/user/1/data
// and push the data to the console and array and log it to the console
// and send the data to the client

const arr = [];
const id = 1;

app.get("/user/:id/:data", (req, res) => {
  arr.push(req.params);
  arr.push(req.query);
  console.log(req.params);
  console.log(req.query);
  res.send({
    message: "User data received",
    params: req.params,
    query: req.query,
    allData: arr,
  });
});

app.get("/user/:id/data", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send({
    message: "User data with additional info received",
    params: req.params,
    query: req.query,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
