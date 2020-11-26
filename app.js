const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const cors = require("cors");
const middleware = require("./utils/middleware");
// const startScrap = require("./scraper");
const notesRouter = require("./controllers/memes");
const JbzScraper = require("./scraper");
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
const jbzScraper = new JbzScraper();

if (process.env.NODE_ENV === "scrap") {
  jbzScraper.fetchPages();
}

app.use(middleware.unknownRequest);

module.exports = app;
