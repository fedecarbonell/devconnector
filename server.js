const express = require("express");
const mongoose = require("mongoose");

// Routes
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");

const app = express();

// DB config & conect
const db = require("./config/keys").mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Main route
app.get("/", (req, res) => res.send("Hello World"));

// Use routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
