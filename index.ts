const app = require("./app");
const config = require("./utils/config");
const http = require("http");
const { info } = require("./utils/logger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  info([`Server is running on port ${config.PORT}`]);
});
