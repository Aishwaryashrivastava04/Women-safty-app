const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var User = require("../Models/user");
var Story = require("../Models/story_tbl");
const crypto = require("crypto");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');

const jwt = require("jsonwebtoken");
const JWT_SECRET = "koiStrongRandomSecret123!";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({ message: "Wrong password" });
}

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login Successfully",
      token,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

const nodemailer = require("nodemailer");

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetLink = `http://localhost:5174/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <h3>Password Reset</h3>
      <p>Click below to reset password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });

  res.json({ message: "Reset link sent to your email" });
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Access Denied. No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

router.post("/add/stories", authMiddleware, async (req, res) => {
  try {
    const storyData = {
      ...req.body,
      createdBy: req.user._id, // ← inject user ID from token
    };

    const story = new Story(storyData);
    await story.save();

    res.status(201).json({ success: true, story });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get("/all/stories", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const allstories = await Story.find({ createdBy: userId });

    res.status(200).json({ success: true, allstories });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get("/stories/:id", async (req, res) => {
  try {
    const stories = await Story.findById(req.params.id);
    res.status(200).send({ stories });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/stories/:id", async (req, res) => {
  try {
    const stories = await Story.findByIdAndDelete(req.params.id);
    res.status(200).send({ stories });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put("/stories/:id", async (req, res) => {
  try {
    const stories = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ stories });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
