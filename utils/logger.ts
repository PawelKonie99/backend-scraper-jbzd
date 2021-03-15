const moment = require("moment");

const info = (...params: string[]) => {
  console.log();
  console.log();
  console.log("===================================================");
  console.log(params);
  console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
  console.log("===================================================");
  console.log();
  console.log();
};

const error = (...params: string[]) => {
  console.log();
  console.log();
  console.log("===================================================");
  console.log("ERROR");
  console.log(params);
  console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
  console.log("===================================================");
  console.log();
  console.log();
};

module.exports = {
  info,
  error,
};
