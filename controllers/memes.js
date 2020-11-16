const notesRouter = require("express").Router();
const Meme = require("../models/meme");

notesRouter.get("/", async (req, res) => {
  const memes = await Meme.find({});
  res.json(memes);
});

module.exports = notesRouter;
