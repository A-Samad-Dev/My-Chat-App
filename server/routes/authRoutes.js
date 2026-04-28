// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user");
const upload = require("../middleware/uploadMiddleware");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");

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
router.post("/login", async (req, res) => {
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

// forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request for: ", email);

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json("User not found");
  }
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save();

  // Send email with reset link
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const clientUrl = "http://localhost:5173";
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset",
    html: `
      <h3 style="color: blue; padding: 10px; font-family: Arial, sans-serif; font-size: 18px;">Password Reset</h3>
      <p style="font-family: Arial, sans-serif; font-size: 16px;">Click the link below (valid for 10 minutes):</p>
      <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"><a href="${clientUrl}/reset-password/${resetToken}" style="color: white; text-decoration: none;">Reset Password</a></button>
      <p style="font-family: Arial, sans-serif; font-size: 16px;">If you are having trouble clicking the link, copy and paste the URL below into your browser:</p>
      <p style="font-family: Arial, sans-serif; font-size: 16px;">${clientUrl}/reset-password/${resetToken}</p>
      <p style="font-family: Arial, sans-serif; font-size: 16px;">If you did not request a password reset, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  console.log("Received token:", token);
  console.log("New password:", newPassword);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found with ID:", decoded.id);
      return res.status(404).json("User not found");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      status: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(500).json("Error resetting password");
  }
});

//  header-based authentication
router.post("/reset-password", async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});
module.exports = router;
