#!/usr/bin/env node

const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const port = 3000;

// Users storage
const users = {};

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ============ AUTH ============

app.post("/users/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email/password" });
    }
    
    if (users[email]) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    
    users[email] = { name: name || "User", email, password, createdAt: new Date() };
    
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: { name: users[email].name, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/users/login", (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email/password" });
    }
    
    const user = users[email];
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }
    
    const token = Buffer.from(email + ":" + Date.now()).toString('base64');
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ API ============

app.get("/api", (req, res) => {
  res.json({ success: true, message: "Backend is working 💚" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error:  "Not found" });
});

// Start
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`🎯 Server listening on 0.0.0.0:${port}`);
});

server.on("error", (err) => {
  console.error(`❌ Error:  ${err.message}`);
  process.exit(1);
});
