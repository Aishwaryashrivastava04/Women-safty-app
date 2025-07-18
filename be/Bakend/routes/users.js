var express = require("express");
var router = express.Router();
var User = require("../Models/user");
var Story = require("../Models/story_tbl");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');

const jwt = require("jsonwebtoken");
JWT_Secret = "wertyu34567890poiuytrewq";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const newUser = new User({ name, email, password });
    const saveUser = await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: saveUser,
      success: true,
    });
  } catch (error) {
    console.error("Register Error", error);
    return res.status(500).json({
      message: error.message || "server not responding",
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_Secret, {
      expiresIn: "7d",
    });

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

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_Secret);
    req.user = decoded; // attach user payload to request
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
