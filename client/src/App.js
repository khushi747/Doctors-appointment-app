// src/App.js
import React, { useState, useEffect } from "react";
import PatientAppointments from "./components/PatientAppointments";
import DoctorAppointments from "./components/DoctorAppointments";
import BookingForm from "./components/BookingForm";
import axios from "axios";

function App() {
  const [patientId, setPatientId] = useState("5f78b1f77321b515d09c3c6f"); // Example patient ID
  const [doctorId, setDoctorId] = useState("5f78af7b7321b515d09c3c6e"); // Example doctor ID
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users?role=doctor");
        setDoctors(response.data.users);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      <h1>Medical Appointment System</h1>

      {/* Patient Appointments */}
      <PatientAppointments patientId={patientId} />

      {/* Booking Form */}
      <BookingForm patientId={patientId} doctors={doctors} />

      {/* Doctor Appointments */}
      <DoctorAppointments doctorId={doctorId} />
    </div>
  );
}

export default App;
