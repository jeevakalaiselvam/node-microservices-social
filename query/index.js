const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");
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

const handleEvent = (type, data) => {
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
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  //Sending all posts when requested
  const { type, data } = req.body;
  log()()("EVENT RECEIVED IN QUERY", [type]);
  handleEvent(type, data);
  res.send({});
});

const PORT = 4002;
app.listen(PORT, async () => {
  log()()("QUERY SERVICE STARTED", [`Listening on PORT ${PORT}`]);

  try {
    const res = await axios.get("http://localhost:4005/events", {});
    console.log(res);

    for (let event of res.data) {
      console.log("Processing Event: ", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
