export {};
import * as helmet from "helmet";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as bp from "body-parser";
import * as schedule from "node-schedule";
import { MONGO_URL } from "./utils/config";
import { info, error } from "./utils/logger";
import { unknownRequest, tokenExtractor } from "./utils/middleware";
import { memeRouter } from "./controllers/memes";
import { loginRouter } from "./controllers/login";
import { usersRouter } from "./controllers/users";
import { JbzScraper } from "./jebzdzidy";
import { KwejkScraper } from "./kwejk";
require("dotenv").config();
const app = express();
// import * as cron from 'node-cron'

const jbzScraper = new JbzScraper();
const kwejkScraper = new KwejkScraper();

info(["connecting to database"]);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    info(["Connected to database!"]);
  })
  .catch((e: Error) => {
    error("Error with connecting to database" + e.message);
  });

app.use(cors());
app.use(helmet());
app.use(express.static("build"));
app.use(tokenExtractor);
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/", memeRouter);
app.use("/", usersRouter);
app.use("/", loginRouter);

const runScrap = async () => {
  await kwejkScraper.fetchPageParam();
  await jbzScraper.fetchPages();
  // return process.exit(0);
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

app.use(unknownRequest);

module.exports = app;
