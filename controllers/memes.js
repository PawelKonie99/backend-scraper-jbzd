const notesRouter = require("express").Router();
const Meme = require("../models/meme");

notesRouter.get("/", async (req, res) => {
  const memes = await Meme.find({});
  res.json(memes);
});

notesRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const result = await Meme.findById(id);
  res.json(result);
});

module.exports = notesRouter;
