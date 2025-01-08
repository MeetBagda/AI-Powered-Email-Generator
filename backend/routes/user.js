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
    email: zod.string().email({ message: "Invalid email address" }),
    password: zod.string().min(6, { message: "Password must be at least 6 characters" }),
});

router.post("/signin", async (req, res) => {
    // Validate request body
    const { success, error } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: error.errors,
        });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return res.status(401).json({
            message: "Incorrect email or password",
        });
    }

    // Compare hashed password (assuming you have a method to compare passwords)
    // const isPasswordValid = await user.comparePassword(req.body.password); // Implement this method in your User model
    // if (!isPasswordValid) {
    //     return res.status(401).json({
    //         message: "Incorrect email or password",
    //     });
    // }

    // Generate token
    const token = jwt.sign(
        {
            userId: user._id,
        },
        JWT_SECRET,
        { expiresIn: '1h' } // Optional: set expiration time for the token
    );

    res.json({
        token: token,
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
