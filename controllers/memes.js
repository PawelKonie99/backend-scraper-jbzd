const notesRouter = require("express").Router();
const Meme = require("../models/meme");
const middleware = require("../utils/middleware");

// notesRouter.get("/", async (req, res) => {
//   const memes = await Meme.find({});
//   res.json(memes);
// });
notesRouter.get(
  "/kwejk",
  middleware.paginatedResults(Meme, "kwejk"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);

notesRouter.get(
  "/jebzdzidy",
  middleware.paginatedResults(Meme, "jebzdzidy"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);

notesRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Meme.findById(id);
  res.json(result);
});

module.exports = notesRouter;
