const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const log = require("./utils/logger");
const { COMMENT_CREATED, COMMENT_MODERATED } = require("./config/event");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  log()()("EVENT RECEIVED IN MODERATION", [type]);
  if (type === COMMENT_CREATED) {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    log()()("SENDING EVENT TO EVENT BUS", [COMMENT_MODERATED]);
    await axios.post("http://localhost:4005/events", {
      type: COMMENT_MODERATED,
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  res.send({});
});

PORT = 4003;
app.listen(PORT, () => {
  log()()("MODERATION SERVICE STARTED", [`Running on PORT ${PORT}`]);
});
