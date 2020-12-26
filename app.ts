export {};
const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const cors = require("cors");
const middleware = require("./utils/middleware");
// const startScrap = require("./scraper");
const memeRouter = require("./controllers/memes");
const JbzScraper = require("./jebzdzidy");
const KwejkScraper = require("./kwejk");
require("dotenv").config();
// const path = require("path");


const jbzScraper = new JbzScraper();
const kwejkScraper = new KwejkScraper();

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
  .catch((e: Error) => {
     logger.error("Error with connecting to database" + e.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use("/", memeRouter);

const runScrap = async () => {
  await kwejkScraper.fetchPageParam();
  await jbzScraper.fetchPages();
  return process.exit(0);
};

if (process.env.NODE_ENV === "scrap") {
  runScrap();
}

const cron = require('node-schedule');
const rule = new cron.RecurrenceRule();
rule.hour = 12;
rule.minute = 0;
cron.scheduleJob(rule, () => {
  runScrap();
});

app.use(middleware.unknownRequest);

module.exports = app;
