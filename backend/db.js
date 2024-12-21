const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(
  process.env.MONGODB_URI
);
const emailSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
  subjectLine: {
    type: String,
    required: true,
  },
  recipients: {
    type: String,
    required: true,
  },
  senders: {
    type: String,
    required: true,
  },
  maxLength: {
    type: Number,
    required: true,
  },
  generatedEmail: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
