const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const router = express.Router();

// Book Appointment
router.post("/book", async (req, res) => {
  const { patientId, doctorId, date } = req.body;

  try {
    // Check if patient and doctor exist
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(400).json({ message: "Patient or Doctor not found" });
    }

    // Check if the doctor is available at the given time
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "Doctor is already booked at this time" });
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

// Get Appointments for a Doctor
router.get("/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Find appointments for the given doctor
    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email") // Populate patient details
      .exec();

    if (!appointments || appointments.length === 0) {
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

// Get Appointments for a Patient
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    // Find appointments for the given patient
    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name email role") // Populate doctor details
      .exec();

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this patient" });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Appointment Status (Doctor Confirms/Rejects)
router.patch("/status/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body; // Expecting 'Confirmed' or 'Rejected'

  try {
    // Validate status
    if (!["Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: `Appointment ${status}`,
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
