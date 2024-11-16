# Doctors Appointment Booking App

This project is a web application where patients can book appointments with doctors, and doctors can view and confirm those appointments. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Patient Features:

- **Sign Up / Log In**: Patients can register and log in to the system.
- **View Doctors**: Patients can view available doctors along with their specializations.
- **Book Appointment**: Patients can choose a doctor, view the available schedule, and book an appointment.
- **View Appointments**: Patients can view their booked appointments and statuses.

### Doctor Features:

- **Sign Up / Log In**: Doctors can register and log in to the system.
- **View Appointments**: Doctors can view the list of appointments requested by patients.
- **Confirm or Reject Appointments**: Doctors can confirm or reject the requested appointments.

### Admin Features (Optional for later):

- **Manage Users**: Admins can manage doctors and patients.
- **Manage Appointments**: Admins can view and manage appointments across the platform.

## Database Schema Design

### **Users Collection**

- `userId`: Unique identifier (String)
- `name`: Full name of the user (String)
- `email`: Email address (String)
- `password`: Encrypted password (String)
- `role`: Role of the user, either "patient" or "doctor" (String)
- `specialization` (for doctors): Specialization field like "Cardiologist" (String)
- `schedule` (for doctors): A list of available time slots (Array of Strings)

### **Appointments Collection**

- `appointmentId`: Unique identifier (String)
- `patientId`: Reference to the patient who booked the appointment (String)
- `doctorId`: Reference to the doctor who is being booked (String)
- `date`: Appointment date and time (String)
- `status`: Status of the appointment, either "Pending," "Confirmed," or "Rejected" (String)

## Installation Instructions

Clone the repository:
   ```bash
   git clone https://github.com/khushi747/Doctors-appointment-app
   cd Doctors-appointment-app
   ```
