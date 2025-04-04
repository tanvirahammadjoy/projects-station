# ✅ What Do We Commonly Do with Backend Frameworks or Runtimes?

Whether you’re using Node.js, Deno, or Bun, and frameworks like Express, Oak, or Elysia, the backend has core jobs:

🔑 1. Routing (handling URLs)
Matching client requests (like GET /, POST /login, etc.) and sending back a response.

app.get('/', (req, res) => res.send('Home Page'))
app.post('/login', (req, res) => res.send('Login user'))
Common tasks:

Define routes (URLs)
Set up route handlers (functions to handle requests)
Group routes (like /api/users, /api/posts)

🔑 2. Receiving and Parsing Data (from clients)
When the frontend sends data (form, JSON), the backend reads and processes it.

app.post('/register', (req, res) => {
  const { username, password } = req.body;
})

From: form data, JSON, file uploads
Tools: body-parser, formidable, built-in JSON parsers

🔑 3. Sending Responses (back to frontend)
Backend replies with:

Text / JSON / HTML / MEDIA
Status codes (200 OK, 404 Not Found, 500 Error)
Sometimes files (images, downloads)

res.json({ success: true, message: "User created" })

🔑 4. Working with Databases (CRUD)
Backend handles Create, Read, Update, Delete operations on data.

Databases used: MongoDB, PostgreSQL, MySQL, SQLite, etc.
Use ORMs or raw queries:
Sequelize, Prisma (Node)
Drizzle, DenoDB (Deno)
BunORM (for Bun soon)

const user = await User.create({ name: "Ali" });

🔑 5. Authentication & Authorization
Check who the user is (auth) and what they can do (permissions).

Login, register, logout
JWT tokens, sessions, cookies
Protecting routes

if (!req.user) return res.status(401).json({ error: "Unauthorized" });

🔑 6. Middleware Functions
Logic that runs before the route handler.

Examples:
Logging requests
Checking login
Parsing body
Rate limiting

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

🔑 7. Serving Static Files
Sending HTML, CSS, JS, images to the browser.

app.use(express.static('public'));
Use it for websites, landing pages, frontend assets, etc.

🔑 8. Error Handling
Catch and respond to bad things:

Wrong input
Crashed route
Server error

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server Error" });
});

🔑 9. Environment Variables & Config
Secrets like DB passwords, API keys are kept private.

Use .env files + dotenv (in Node)
Deno and Bun also support .env

🔑 10. APIs for Frontend / Mobile / Others
Backend is often used to:

Power a frontend (React, Vue)
Serve APIs for mobile apps
Integrate with 3rd party APIs (e.g. Stripe, OpenAI, etc.)

Bonus: Real Examples
Task                Route Type              Example
Show homepage       GET /                   Website root
Register user       POST /register          Form or JSON data
Get all blog posts  GET /posts              API endpoint
Update profile info PUT /users/:id          JSON update
Delete a product    DELETE /product/:id     Admin route

🎯 Summary
The backend is the brain of our app. It:

Accepts requests
Processes logic
Talks to databases
Sends responses
Protects data
Powers frontend and mobile apps

And frameworks help you do all of this:
💨 Faster, cleaner, and more safely!
