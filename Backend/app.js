const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// const { router: userRouter } = require("./routes/userRoutes");
// app.js
const { router: userRouter, protect } = require("./routes/userRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const appoRoutes = require("./routes/appoRoutes");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRouter); // Set up the /api/users route
app.use("/api/appointments", appointmentRouter); // Set up the /api/appointments route

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
