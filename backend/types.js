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
    tone: z.string().optional()
});

const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3, "Username must be at least 3 character"),
  password: z.string().min(4, "Password must be at least 4 character"),
});

const getAllEmailSchema = z.object({});
const getAllUserSchema = z.object({});

module.exports = { generateEmailSchema, getAllEmailSchema, userSchema, getAllUserSchema };