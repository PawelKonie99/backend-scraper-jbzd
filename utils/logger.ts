const fs = require("fs");
const moment = require("moment");

const info = (params: string[], lvl: string = "info") => {
  console.log();
  console.log("===================================================");
  console.log(params);
  console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
  console.log("===================================================");
  console.log();

  const logObject = {
    message: "",
    date: moment().format("MMMM Do YYYY, h:mm:ss a"),
  };
  logObject.message = JSON.stringify(params);

  const logObjectToString = `${JSON.stringify(logObject)} \r\n`;

  const todayDate = moment().format("DD:MM:YYYY").replace(":", "");

  try {
    const logStream = fs.createWriteStream(
      `utils/logs/${lvl}${todayDate}.txt`,
      {
        flags: "a",
      }
    );
    logStream.write(logObjectToString);
    logStream.end("\r\n");
  } catch (e) {
    error(e);
  }
};

const error = (...params: string[]) => {
  console.log();
  console.log("===================================================");
  console.log("ERROR");
  console.log(params);
  console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
  console.log("===================================================");
  console.log();

  const logObject = {
    message: "",
    date: moment().format("MMMM Do YYYY, h:mm:ss a"),
  };
  logObject.message = JSON.stringify(params);

  const logObjectToString = `${JSON.stringify(logObject)} \r\n`;

  const todayDate = moment().format("DD:MM").replace(":", "");

  try {
    const logStream = fs.createWriteStream(`utils/logs/error${todayDate}.txt`, {
      flags: "a",
    });
    logStream.write(logObjectToString);
    logStream.end("\r\n");
  } catch (e) {
    error(e);
  }
};

module.exports = {
  info,
  error,
};
