export {};
const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const cors = require("cors");
const middleware = require("./utils/middleware");
const memeRouter = require("./controllers/memes");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const JbzScraper = require("./jebzdzidy");
const KwejkScraper = require("./kwejk");
const bp = require("body-parser");
require("dotenv").config();
const schedule = require("node-schedule");
// import * as cron from 'node-cron'

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
app.use(middleware.tokenExtractor);
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/", memeRouter);
app.use("/", usersRouter);
app.use("/", loginRouter);

const runScrap = async () => {
  await kwejkScraper.fetchPageParam();
  await jbzScraper.fetchPages();
  return process.exit(0);
};

if (process.env.NODE_ENV === "scrap") {
  runScrap();
}

// cron.schedule('*/8 * * * *', () => {
//   console.log('cron works every hour')
//   runScrap();
// });

// scrapers are working everyday at 8 pm
schedule.scheduleJob("0 8 * * *", function () {
  runScrap();
});

app.use(middleware.unknownRequest);

module.exports = app;
