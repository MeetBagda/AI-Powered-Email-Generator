const express = require("express");
const app = express();
const cors = require("cors");
const { generateEmailSchema, userSchema, getAllUserSchema } = require("./types");
const {Email, User} = require("./db");
const axios = require("axios");

app.use(express.json());
app.use(cors());

app.post("/generate-email", async (req, res) => {
  const createPayLoad = req.body;
  const parsedPayLoad = generateEmailSchema.safeParse(createPayLoad);

  if (!parsedPayLoad.success) {
    return res.status(411).json({
      msg: "You sent the wrong inputs",
      errors: parsedPayLoad.error.issues,
    });
  }

  try {
    const pythonResponse = await axios.post(
      "http://127.0.0.1:5000/generate-email",
      createPayLoad
    );

    const generatedEmail = pythonResponse.data.email;

    await Email.create({
      purpose: createPayLoad.purpose,
      subjectLine: createPayLoad.subjectLine,
      recipients: createPayLoad.recipients,
      senders: createPayLoad.senders,
      maxLength: createPayLoad.maxLength,
      tone: createPayLoad.tone || "professional",
      generatedEmail: generatedEmail || "",
      createdAt: new Date(),
    });

    console.log(createPayLoad);

    res.json({
      msg: "Email created",
      email: generatedEmail,
    });
  } catch (error) {
    console.error("Error during email generation:", error);
    res
      .status(500)
      .json({ msg: "Error generating or saving email", error: error.message });
  }
});

app.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find();
    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res
      .status(500)
      .json({ msg: "Error fetching emails", error: error.message });
  }
});

app.post("/user", async (req, res) => {
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

app.post("/signin", async (req, res) => {
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

app.get("/users", async (req, res) => {
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

app.listen(8888, () => {
  console.log("Server running successfully");
});