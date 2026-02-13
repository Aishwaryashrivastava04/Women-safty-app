var express = require("express");
var router = express.Router();
var Story = require("../Models/story_tbl");

/* ✅ API health check */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is working 💚",
  });
});

/* ➕ Add story */
router.post("/add/stories", async (req, res) => {
  try {
    const story = new Story(req.body);
    await story.save();
    res.status(201).json({ story });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* 📄 Get all stories */
router.get("/all/stories", async (req, res) => {
  try {
    const allstories = await Story.find({});
    res.status(200).json({ allstories });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ❌ Delete story */
router.delete("/stories/:id", async (req, res) => {
  try {
    const stories = await Story.findByIdAndDelete(req.params.id);
    res.status(200).send({ stories });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

/* ✏️ Update story */
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

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API working 💚"
  });
});