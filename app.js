const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const cors = require("cors");
const middleware = require("./utils/middleware");
// const startScrap = require("./scraper");
const notesRouter = require("./controllers/memes");
require("dotenv").config();

logger.info("connecting to database");

mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("Connected to database!");
  })
  .catch(() => {
    logger.error("Error with connecting to database", error.message);
  });

app.use(cors());
app.use("/memes", notesRouter);

if (process.env.NODE_ENV === "scrap") {
  const startScrap = require("./scraper");
  startScrap;
}

app.use(middleware.unknownRequest);

module.exports = app;
