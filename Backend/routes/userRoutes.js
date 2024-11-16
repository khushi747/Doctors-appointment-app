const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Use environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "password";

// Middleware to protect routes
const protect = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  };
};

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, role, specialization, schedule } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please provide all required fields",
        missing: Object.entries({ name, email, password, role })
          .filter(([_, value]) => !value)
          .map(([key]) => key),
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      specialization,
      schedule,
    });

    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialization: newUser.specialization,
        schedule: newUser.schedule,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        missing: Object.entries({ email, password })
          .filter(([_, value]) => !value)
          .map(([key]) => key),
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email });
    console.log("Login attempt for email:", email);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful for user:", user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        schedule: user.schedule,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
});

// Get User Profile
router.get(
  "/profile",
  protect(["admin", "doctor", "patient"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update User Profile
router.put(
  "/profile",
  protect(["admin", "doctor", "patient"]),
  async (req, res) => {
    try {
      const { name, email, specialization, schedule } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.specialization = specialization || user.specialization;
      user.schedule = schedule || user.schedule;

      const updatedUser = await user.save();
      console.log("Profile updated for user:", updatedUser._id);

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        specialization: updatedUser.specialization,
        schedule: updatedUser.schedule,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

module.exports = {
  router,
  protect,
};
