// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const upload = require("../middleware/uploadMiddleware");
const streamifier = require("streamifier");

const router = express.Router();

// REGISTER
router.post("/register", upload.single("avatar"), async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return res.status(400).json("All fields are required");
  }

  const hashed = await bcrypt.hash(password, 10);

  let avatarUrl = "";
  if (req.file) {
    avatarUrl = await new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          console.log("this is the result from the file upload: ", result);
          if (result) resolve(result.secure_url);
          else reject(error);
        },
      );
      console.log("this is the file and buffer", req.file, req.file.buffer);

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  }
  const user = await User.create({
    username,
    email,
    password: hashed,
    avatar: avatarUrl,
  });

  res.status(201).json(user);
  user.save();
});

// LOGIN
router.post("/login",  async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );

  res.json({ token, user });
});

module.exports = router;
