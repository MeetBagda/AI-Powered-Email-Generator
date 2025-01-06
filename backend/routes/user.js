const express = require("express");
const router = express.Router();
const cors = require("cors");
const { generateEmailSchema, userSchema, getAllUserSchema } = require("../types");
const {User} = require("../db");
const axios = require("axios");

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
  
      res.json({
        msg: "User created",
        user: user,
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
  
  router.post("/signin", async (req, res) => {
    const {email, password} = req.body;
     try {
       const user = await User.findOne({ email });
       if (!user) {
         return res.status(404).json({ msg: "User not found" });
         }
  
        if(user.password !== password){
           return res.status(401).json({msg: "Incorrect Password"})
          }
  
      res.status(200).json({ msg: "Logged in", user });
   } catch (error) {
       console.error("Error during User sign in:", error);
        res
           .status(500)
           .json({ msg: "Error signing in", error: error.message });
   }
  });
  
  router.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ msg: "Error fetching users", error: error.message });
    }
  });


  module.exports= router;