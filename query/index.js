const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const log = require("./utils/logger");

//Clearing Console
console.clear();

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Storing Posts and Comments
const posts = {};

app.get("/posts", (req, res) => {
  //Sending all posts when requested
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log("Reached events in Query");
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  log()("INFO")("POSTS INFORMATION", [posts]);
  res.send({});
});

const PORT = 4002;
app.listen(PORT, () => {
  log()()("QUERY SERVICE STARTED", [`Listening on PORT ${PORT}`]);
});
