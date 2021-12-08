export {};
const adminRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

adminRouter.post("/api/admin", async (req, res) => {
    const body = req.body;

    const isAdminLogged: {
        username: string;
        _id: string;
    } = await User.findOne({ username: body.username });

    if (!isAdminLogged) {
        return res.status(400).json({
            error: "Invalid username or password",
        });
    }

    const allUsers = await User.find();

    res.status(200).json({ allUsers });
});

module.exports = adminRouter;
