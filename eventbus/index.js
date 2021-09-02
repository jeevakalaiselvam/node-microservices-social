const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const log = require("./utils/logger");

//Clearing Console
console.clear();

app.use(bodyParser.json());

//Handling events and forwarding them to all services
app.post("/events", (req, res) => {
  const event = req.body;
  log()()("EVENT RECEIVED - EVENT BUS", [event]);

  //POSTS SERVICE
  log()()("FORWARDING EVENT TO POSTS", []);
  axios.post("http://localhost:4000/events", event).catch((error) => {
    console.log(error.message);
  });

  //COMMENTS SERVICE
  log()()("FORWARDING EVENT TO COMMENTS", []);
  axios.post("http://localhost:4001/events", event).catch((error) => {
    console.log(error.message);
  });

  //QUERY SERVICE
  log()()("FORWARDING EVENT TO QUERY", []);
  axios.post("http://localhost:4002/events", event).catch((error) => {
    console.log(error.message);
  });

  res.send({ status: "OK" });
});

//EVENT BUS RUNNING ON PORT 4005
const PORT = 4005;
app.listen(PORT, () => {
  log()("INFO")("EVENTBUS STARTED", [`Listening on PORT ${PORT}`]);
});
