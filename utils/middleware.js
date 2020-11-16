const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownRequest = (req, res) => {
  res.status(404).send({ error: "Unknow endpoint" });
};

module.exports = {
  requestLogger,
  unknownRequest,
};
