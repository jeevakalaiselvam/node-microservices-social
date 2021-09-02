const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { randomBytes } = require("crypto");
const { json } = require("express");
const axios = require("axios");
const log = require("./utils/logger");

//Clearing Console
console.clear();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.post("/events", (req, res) => {
  log()()("EVENT RECEIVED IN COMMENTS", [req.body.type]);
  res.send({});
});

//Getting comments for a post
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
  log()()("GETTING COMMENT FOR POST", [`POST_ID - ${req.params.id}`]);
});

//Adding a new comment to a post
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  log()()("ADDING COMMENT TO POST", [
    `POST_ID - ${req.params.id}`,
    `COMMENT_DATA - ${req.body} `,
  ]);

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({
    id: commentId,
    content: content,
  });
  commentsByPostId[req.params.id] = comments;

  log()()("SENDING EVENT TO EVENT BUS", ["COMMENT CREATED"]);
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).json(comments);
});

const PORT = 4001;
app.listen(PORT, () => {
  log()("INFO")("COMMENTS SERVER STARTED", [`Listening on PORT ${PORT}`]);
});
