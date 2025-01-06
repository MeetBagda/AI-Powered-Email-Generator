const express = require("express");
const app = express();
const cors = require("cors");
const { generateEmailSchema, userSchema, getAllUserSchema } = require("./types");
const {Email, User} = require("./db");
const axios = require("axios");
const rootRouter = require('./routes/index')

app.use(express.json());
app.use(cors());

app.use('/api/v1', rootRouter)

app.listen(8888, () => {
  console.log("Server running successfully");
});