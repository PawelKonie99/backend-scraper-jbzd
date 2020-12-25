const memeRouter = require("express").Router();
const Meme = require("../models/meme");
const middleware = require("../utils/middleware");
const path = require("path");
// notesRouter.get("/", async (req, res) => {
//   const memes = await Meme.find({});
//   res.json(memes);
// });

memeRouter.get(
  "/kwejk",
  middleware.paginatedResults(Meme, "kwejk"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);

memeRouter.get(
  "/jebzdzidy",
  middleware.paginatedResults(Meme, "jebzdzidy"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);

memeRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Meme.findById(id);
  res.json(result);
});

memeRouter.get("/*", async (req, res) => {
  const index = path.join(__dirname, "../build", "index.html");
  res.sendFile(index);
});

module.exports = memeRouter;
