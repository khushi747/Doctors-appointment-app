const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { protect } = require("./userRoutes");

const router = express.Router();

// Book an appointment
router.post("/", protect(["patient"]), async (req, res) => {
  const { doctorId, appointmentTime } = req.body;
  const patientId = req.user.id;

  try {
    // Ensure the doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor" });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      appointmentTime,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("Appointment booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
