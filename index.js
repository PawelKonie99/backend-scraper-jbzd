const app = require("./app");
const config = require("./utils/config");
const http = require("http");
const logger = require("./utils/logger");

const server = http.createServer(app);
console.log('dupa')

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
