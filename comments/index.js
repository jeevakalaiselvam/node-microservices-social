const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { randomBytes } = require("crypto");
const { json } = require("express");
const axios = require("axios");
const log = require("./utils/logger");
const {
  COMMENT_MODERATED,
  COMMENT_UPDATED,
  COMMENT_CREATED,
} = require("./config/event");

//Clearing Console
console.clear();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);
  log()()("EVENT RECEIVED IN COMMENTS", [type]);

  if (type === COMMENT_MODERATED) {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: COMMENT_UPDATED,
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

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
    status: "pending",
  });
  commentsByPostId[req.params.id] = comments;

  log()()("SENDING EVENT TO EVENT BUS", [COMMENT_CREATED]);
  await axios.post("http://event-bus-srv:4005/events", {
    type: COMMENT_CREATED,
    data: {
      id: commentId,
      content: content,
      status: "pending",
      postId: req.params.id,
    },
  });

  res.status(201).json(comments);
});

const PORT = 4001;
app.listen(PORT, () => {
  log()("INFO")("COMMENTS SERVER STARTED", [`Listening on PORT ${PORT}`]);
});
