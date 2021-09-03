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

const events = [];

//Handling events and forwarding them to all services
app.post("/events", async (req, res) => {
  const event = req.body;

  //Storing all events
  log()()("EVENT RECEIVED - EVENTBUS", [event]);
  events.push(event);
  log()()("ALL EVENTS IN EVENTBUS", [...events]);

  log()()("FORWARDING EVENT TO POSTS, COMMENTS, QUERY, MODERATION", [
    event.type,
  ]);

  //POSTS SERVICE
  await axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((error) => {
      console.log(error.message);
    });

  // //COMMENTS SERVICE
  // await axios.post("http://localhost:4001/events", event).catch((error) => {
  //   console.log(error.message);
  // });

  // //QUERY SERVICE
  // await axios.post("http://localhost:4002/events", event).catch((error) => {
  //   console.log(error.message);
  // });

  // //MODERATION SERVICE
  // await axios.post("http://localhost:4003/events", event).catch((error) => {
  //   console.log(error.message);
  // });

  res.status(200).send({ status: "ok" });
});

//Get all events stored
app.get("/events", (req, res) => {
  res.send(events);
});

//EVENT BUS RUNNING ON PORT 4005
const PORT = 4005;
app.listen(PORT, () => {
  log()("INFO")("EVENTBUS STARTED", [`Listening on PORT ${PORT}`]);
});
