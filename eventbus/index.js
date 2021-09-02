const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const log = require("./utils/logger");
const cors = require("cors");

//Clearing Console
console.clear();

app.use(bodyParser.json());
app.use(cors());

//Handling events and forwarding them to all services
app.post("/events", async (req, res) => {
  const event = req.body;
  log()()("EVENT RECEIVED - EVENTBUS", [event]);

  //POSTS SERVICE
  log()()("FORWARDING EVENT TO POSTS", [event.type]);
  await axios.post("http://localhost:4000/events", event).catch((error) => {
    console.log(error.message);
  });

  //COMMENTS SERVICE
  log()()("FORWARDING EVENT TO COMMENTS", [event.type]);
  await axios.post("http://localhost:4001/events", event).catch((error) => {
    console.log(error.message);
  });

  //QUERY SERVICE
  log()()("FORWARDING EVENT TO QUERY", [event.type]);
  await axios.post("http://localhost:4002/events", event).catch((error) => {
    console.log(error.message);
  });

  //MODERATION SERVICE
  log()()("FORWARDING EVENT TO MODERATION", [event.type]);
  await axios.post("http://localhost:4003/events", event).catch((error) => {
    console.log(error.message);
  });

  res.status(200).send({ status: "ok" });
});

//EVENT BUS RUNNING ON PORT 4005
const PORT = 4005;
app.listen(PORT, () => {
  log()("INFO")("EVENTBUS STARTED", [`Listening on PORT ${PORT}`]);
});
