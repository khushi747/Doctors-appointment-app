// src/components/PatientAppointments.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/patient/${patientId}`);
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div>
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>Doctor: {appointment.doctorId.name}</p>
              <p>Date: {new Date(appointment.date).toLocaleString()}</p>
              <p>Status: {appointment.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientAppointments;
