const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  generateEmailSchema,
  userSchema,
  getAllUserSchema,
} = require("../types");
const { User } = require("../db");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const zod = require('zod')

router.post("/signup", async (req, res) => {
  const createPayLoad = req.body;
  const parsedPayLoad = userSchema.safeParse(createPayLoad);

  if (!parsedPayLoad.success) {
    return res.status(411).json({
      msg: "You sent the wrong inputs",
      errors: parsedPayLoad.error.issues,
    });
  }

  try {
    const user = await User.create({
      email: createPayLoad.email,
      username: createPayLoad.username,
      password: createPayLoad.password,
    });

    console.log(createPayLoad);
    const userId = user._id;

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.json({
      msg: "User created",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Error during User creation:", error);
    if (error.code === 11000) {
      const key = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ msg: `${key} already registered` });
    }
    res
      .status(500)
      .json({ msg: "Error generating or saving user", error: error.message });
  }
});

const signinBody = zod.object({
    username: zod.string().min(3).max(30),
  password: zod.string().min(6),
})
router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "incorrect username or password",
  });
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
});

module.exports = router;
