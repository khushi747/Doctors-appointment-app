const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { protect } = require("./userRoutes"); // Import 'protect' middleware from userRoutes

const router = express.Router();

// Book Appointment
router.post("/book", protect(["patient"]), async (req, res) => {
  const { patientId, doctorId, date } = req.body;

  try {
    // Check if patient and doctor exist
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(400).json({ message: "Patient or Doctor not found" });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all appointments for a specific patient
router.get(
  "/patient/:patientId",
  protect(["patient", "doctor"]),
  async (req, res) => {
    const { patientId } = req.params;

    try {
      const appointments = await Appointment.find({ patientId });

      if (!appointments.length) {
        return res.status(404).json({ message: "No appointments found" });
      }

      res.status(200).json({ appointments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all appointments for a specific doctor
router.get("/doctor/:doctorId", protect(["doctor"]), async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await Appointment.find({ doctorId });

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Confirm or reject appointment by doctor
router.put("/confirm/:appointmentId", protect(["doctor"]), async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body; // status can be 'confirmed' or 'rejected'

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to confirm this appointment",
      });
    }

    appointment.status = status;
    await appointment.save();

    res
      .status(200)
      .json({ message: `Appointment ${status} successfully`, appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
