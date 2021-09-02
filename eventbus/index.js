const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

//Clearing Console
console.clear();

app.use(bodyParser.json());

//Handling events and forwarding them to all services
app.post("/events", (req, res) => {
  const event = req.body;
  console.log("EVENT RECEIVED -> ", event);

  //POSTS SERVICE
  axios.post("http://localhost:4000/events", event).catch((error) => {
    console.log(error.message);
  });

  //COMMENTS SERVICE
  axios.post("http://localhost:4001/events", event).catch((error) => {
    console.log(error.message);
  });

  //QUERY SERVICE
  axios.post("http://localhost:4002/events", event).catch((error) => {
    console.log(error.message);
  });

  res.send({ status: "OK" });
});

//EVENT BUS RUNNING ON PORT 4005
const PORT = 4005;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
