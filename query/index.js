const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const log = require("./utils/logger");
const {
  COMMENT_UPDATED,
  POST_CREATED,
  COMMENT_CREATED,
} = require("./config/event");

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
  const { type, data } = req.body;
  log()()("EVENT RECEIVED IN QUERY", [type]);
  if (type === POST_CREATED) {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === COMMENT_CREATED) {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === COMMENT_UPDATED) {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }

  log()("INFO")("POSTS INFORMATION", [posts]);
  res.send({});
});

const PORT = 4002;
app.listen(PORT, () => {
  log()()("QUERY SERVICE STARTED", [`Listening on PORT ${PORT}`]);
});
