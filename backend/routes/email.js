const express = require("express");
const router = express.Router();
const cors = require("cors");
const { generateEmailSchema, userSchema, getAllUserSchema } = require("../types");
const {Email} = require("../db");
const axios = require("axios");
const { authMiddleware } = require("../middleware");

router.post("/generate-email",authMiddleware, async (req, res) => {
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
        "https://ai-powered-email-generator-1.onrender.com/generate-email",
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
        userId: req.userId, // Add userId from authenticated user
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

  router.get("/emails/user/:userId", authMiddleware, async (req, res) => {
    try {
          const userId = req.params.userId; //Extract user id from parameters
        if (req.userId !== userId) {
            return res.status(403).json({msg: "Unauthorized"})
        }
  
      const emails = await Email.find({ userId: userId })
  
      res.status(200).json({
        msg: "Email history for user retrieved.",
        emails: emails,
      });
    } catch (error) {
      console.error("Error fetching email history:", error);
      res.status(500).json({
        msg: "Error fetching email history",
        error: error.message,
      });
    }
  });

  // New GET request for getting only favorite emails
router.get("/emails/user/:userId/favorites", async (req, res) => {
  try {
      const userId = req.params.userId;

       const favoriteEmails = await Email.find({ userId: userId, isFavorite: true }).sort({ createdAt: -1 });
      res.status(200).json({
        msg: "Favorite emails retrieved.",
        emails: favoriteEmails,
      });
  } catch (error) {
      console.error("Error fetching favorite emails:", error);
      res.status(500).json({
        msg: "Error fetching favorite emails",
        error: error.message,
      });
  }
});

router.put("/emails/:emailId/favorite", async (req, res) => {
  const { emailId } = req.params;
  try {
      const email = await Email.findById(emailId);
      if (!email) {
          return res.status(404).json({ msg: "Email not found" });
      }

     
      email.isFavorite = !email.isFavorite;
      await email.save();
      res.status(200).json({ msg: "Email favorite status updated", email });
  } catch (error) {
      console.error("Error updating email favorite status:", error);
      res.status(500).json({
          msg: "Error updating email favorite status",
          error: error.message,
      });
  }
});

  module.exports = router;