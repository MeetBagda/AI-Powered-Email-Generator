const express = require("express");
const app = express();
const cors = require("cors");
const { generateEmailSchema, userSchema } = require("./types");
const Email = require("./db");
const axios = require("axios");
const User = require("./db");

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
    await User.create({
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
    console.error("Error during email generation:", error);
    res
      .status(500)
      .json({ msg: "Error generating or saving email", error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res
      .status(500)
      .json({ msg: "Error fetching emails", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running successfully");
});
