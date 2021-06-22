export {};
const loginRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

loginRouter.post("/api/login", async (req, res) => {
  const body = req.body;

  const registeredUser: {
    username: string;
    passwordHash: string;
    _id: string;
  } = await User.findOne({ username: body.username });
  const correctPassword: string = registeredUser
    ? await bcrypt.compare(body.password, registeredUser.passwordHash)
    : false;

  if (!(registeredUser && correctPassword)) {
    return res.status(400).json({
      error: "Invalid username or password",
    });
  }

  const userForToken: { username: string; id: string } = {
    username: registeredUser.username,
    id: registeredUser._id,
  };

  const token = await jwt.sign(userForToken, process.env.SECRET);

  res.status(200).json({ token, username: registeredUser.username });
});

module.exports = loginRouter;
