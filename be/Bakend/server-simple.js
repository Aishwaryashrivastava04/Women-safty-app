#!/usr/bin/env node

/**
 * Simple Express server - no app.js dependencies
 * Includes mock auth for Android testing
 */

// Load env safely (skip if file not readable)
try {
  require("dotenv").config({ override: false });
} catch (e) {
  console.log("[server] Dotenv skipped (no .env or permission issue)");
}

const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const port = process.env.PORT || 3000;
const JWT_Secret = "wertyu34567890poiuytrewq";

// In-memory user storage (for testing)
const users = {};

// Simple token generator
function generateToken(email) {
  return Buffer.from(`${email}:${Date.now()}`).toString('base64');
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ============ AUTH ENDPOINTS ============

// Register endpoint
app.post("/users/register", (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check if user exists
    if (users[email]) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Store user
    users[email] = {
      name: name || "User",
      email,
      password, // In production, hash this!
      contact: contact || "",
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { name: users[email].name, email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
});

// Login endpoint
app.post("/users/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check if user exists
    const user = users[email];
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist"
      });
    }

    // Verify password (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // Generate token
    const token = generateToken(user.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
});

// ============ API ENDPOINTS ============

// Simple API endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is working 💚"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

// Start server
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`🎯 Server listening on 0.0.0.0:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${port} is already in use`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
