export {};
const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const cors = require("cors");
const middleware = require("./utils/middleware");
const memeRouter = require("./controllers/memes");
const JbzScraper = require("./jebzdzidy");
const KwejkScraper = require("./kwejk");
require("dotenv").config();
import * as cron from 'node-cron'


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

cron.schedule('0 */8 * * *', () => {
  console.log('cron works every hour')
  runScrap();
});

app.use(middleware.unknownRequest);

module.exports = app;
