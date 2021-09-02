const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

//Clearing Console
console.clear();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.json(posts);
  logPosts();
});
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).json(posts[id]);
  logPosts();
});

const logPosts = () => {
  console.log("=================== POSTS ======================");
  console.log(posts);
  console.log("================================================");
};

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
