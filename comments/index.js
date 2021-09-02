const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { randomBytes } = require("crypto");
const { json } = require("express");

//Clearing Console
console.clear();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
  logComments();
});
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({
    id: commentId,
    content: content,
  });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).json(comments);
  logComments();
});

const logComments = () => {
  console.log("=================== COMMENTS ======================");
  console.log(commentsByPostId);
  console.log("================================================");
};

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
