// src/components/BookingForm.js
import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ patientId, doctors }) => {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/appointments/book", {
        patientId,
        doctorId,
        date,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error booking appointment.");
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Doctor:
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Date:
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Book Appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;
