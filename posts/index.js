const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");
const log = require("./utils/logger");
const { POST_CREATED } = require("./config/event");

//Clearing Console
console.clear();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post("/events", (req, res) => {
  log()()("EVENT RECEIVED IN POSTS", [req.body.type]);
  res.send({});
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };
  log()()("ADDING NEW POST", [posts[id]]);

  log()()("SENDING EVENT TO EVENT BUS", [POST_CREATED]);
  await axios.post("http://event-bus-srv:4005/events", {
    type: POST_CREATED,
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

const PORT = 4000;
app.listen(PORT, () => {
  log()("INFO")("POSTS SERVER STARTED", [`Listening on PORT ${PORT}`]);
});
