const express = require("express");
const router = express.Router();
const cors = require("cors");
const { generateEmailSchema, userSchema, getAllUserSchema } = require("../types");
const {Email} = require("../db");
const axios = require("axios");

router.post("/generate-email", async (req, res) => {
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
  
  router.get("/emails", async (req, res) => {
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

  module.exports = router;