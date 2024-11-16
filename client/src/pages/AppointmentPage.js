import React, { useState, useEffect } from "react";
import axios from "axios";

const AppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  // Fetch doctors from the backend when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/users/doctors");
        setDoctors(response.data);
      } catch (error) {
        setMessage("Error fetching doctors");
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentTime) {
      setMessage("Please select a doctor and appointment time.");
      return;
    }

    try {
      // Send appointment request to the backend
      const response = await axios.post("/api/appointments", {
        doctorId: selectedDoctor,
        appointmentTime,
      });
      setMessage("Appointment booked successfully!");
    } catch (error) {
      setMessage("Error booking appointment.");
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="doctor">Select Doctor:</label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointmentTime">Appointment Time:</label>
          <input
            type="datetime-local"
            id="appointmentTime"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
          />
        </div>

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentPage;
