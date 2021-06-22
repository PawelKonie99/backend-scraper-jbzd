export {};
export const usersRouter = require("express").Router();
const User = require("../models/user");
import * as bcrypt from "bcrypt";

interface NewUserInterface {
  username: string;
  password: string;
}

usersRouter.post("/api/users", async (req, res) => {
  const body: NewUserInterface = req.body;

  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const isUserExist = await User.findOne({ username: body.username });

  if (isUserExist) {
    return res.status(200).json({
      message: "User is already registered",
    });
  }

  const newUser = new User({
    username: body.username,
    passwordHash,
  });

  const user = await newUser.save();

  res.status(200).json(user);
});

// module.exports = usersRouter;
