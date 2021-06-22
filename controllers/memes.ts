export {};
const memeRouter = require("express").Router();
const Meme = require("../models/meme");
const middleware = require("../utils/middleware");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const fs = require("fs");
const mongoBinary = require("mongodb").Binary;

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

memeRouter.get("/memes/default", async (req, res) => {
  const memes = await User.find({}).populate("user", { date: 1 });
  res.json(memes);
});

memeRouter.get(
  "/memes/user",
  middleware.paginatedResults(Meme, "default"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);

memeRouter.get(
  "/memes/usersMemes",
  middleware.paginatedResults(Meme, "default"),
  (req, res) => {
    console.log("sending default");
    res.json(res.paginatedResults);
  }
);

memeRouter.get(
  "/memes/kwejk",
  middleware.paginatedResults(Meme, "kwejk"),
  (req, res) => {
    console.log("sending kwejk");
    res.json(res.paginatedResults);
  }
);

memeRouter.get(
  "/memes/jebzdzidy",
  middleware.paginatedResults(Meme, "jebzdzidy"),
  (req, res) => {
    console.log("sending dzida");
    res.json(res.paginatedResults);
  }
);

memeRouter.get("/memes/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Meme.findById(id);
  res.json(result);
});

memeRouter.get("*", async (req, res) => {
  console.log("sending index.html");
  const index = path.join(__dirname, "../build", "index.html");
  res.sendFile(index);
});

const validateToken = (req) => {
  const authorization = req.authorization;

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
};

// memeRouter.get("/memes/newmeme", async (req, res) => {
//   console.log("elo");
// });

memeRouter.post("/memes/add", upload.single("newMeme"), async (req, res) => {
  const file = req.file;
  let imageBuffer;

  if (!file) {
    console.log("Please upload file");
    return;
  }

  if (req.file.originalname.match(/jfif/i)) {
    console.log("Wrong file type");
    return;
  }

  fs.readFile(req.file.path, function (err, data) {
    if (err) throw err;
    // data will contain your file contents
    // console.log("the data is : ", data);
    imageBuffer = data;
  });

  // const body = req.body;
  const token: string = validateToken(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!(decodedToken || token)) {
    res.status(401).json({
      error: "Token invalid or missing",
    });
  }

  const user = await User.findById(decodedToken.id);

  const newMeme = new Meme({
    title: req.body.title,
    photoUrl: req.file.filename,
    website: "default",
    user: user._id,
    mimeType: req.file.mimetype,
    buffer: mongoBinary(imageBuffer),
  });

  if (newMeme.photoUrl === undefined) {
    return;
  }

  try {
    const newMemeToSave = await newMeme.save();
    user.memes = user.memes.concat(newMemeToSave._id);
    await user.save();
    res.status(201).json(newMemeToSave);
  } catch (e) {
    res.send(e);
  }
});

module.exports = memeRouter;
