// backend/types.js

const z = require("zod");

const generateEmailSchema = z.object({
  purpose: z.string().min(3, "Purpose must be at least 3 character"),
  subjectLine: z.string().min(3, "Subject line must be at least 3 character"),
  recipients: z.string().min(3, "Recipients must be at least 3 character"),
  senders: z.string().min(3, "Senders must be at least 3 character"),
  maxLength: z
    .number()
    .min(50, "Max length cannot be less than 50")
    .max(800, "Max Length must be smaller than 800"),
});

const getAllEmailSchema = z.object({});

module.exports = { generateEmailSchema, getAllEmailSchema };
