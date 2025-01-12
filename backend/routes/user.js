const express = require("express");
const router = express.Router();
const { userSchema } = require("../types");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const zod = require('zod');


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

        const userId = user._id;

        const token = jwt.sign(
            {
                userId,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            msg: "User created",
            user: {
               email: user.email,
               username: user.username,
               _id: user._id
            },
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
    password: zod.string()
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

    try{
       // Find user by email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
            });
        }


        // Compare plain text passwords
        if (req.body.password !== user.password) {
          return res.status(401).json({
              message: "Incorrect email or password",
          });
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: user._id,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token: token,
            user: {
              email: user.email,
              username: user.username,
             _id: user._id
         }
        });

    }catch(error){
        console.error("Error during signin:", error);
        res.status(500).json({
           message: "Failed to sign in",
           error: error.message,
        })
    }
});



router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "_id username email"); // Select only _id, username and email
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: "Error fetching users", error: error.message });
    }
});


module.exports = router;