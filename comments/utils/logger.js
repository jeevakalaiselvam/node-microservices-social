const { format } = require("date-fns");

const logger =
  (date = format(new Date(), "yyyy-MM-dd, hh-mm-ss")) =>
  (type = "DEBUG") =>
  (title, message = []) => {
    console.log(
      "---------------------------------------------------------------------------------------------------------------"
    );
    console.log(`${date}- ${type} - ${title}`);
    message.forEach((msg) => {
      console.log(msg);
    });
  };

module.exports = logger;
