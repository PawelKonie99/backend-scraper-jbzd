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

  try {
    fs.appendFile(`utils/logs/${lvl}.txt`, logObjectToString, function (err) {
      if (err) return console.log(err);
    });
  } catch (e) {
    console.log(e);
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

  try {
    fs.appendFile(`utils/logs/error.txt`, logObjectToString, function (err) {
      if (err) return console.log(err);
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  info,
  error,
};
