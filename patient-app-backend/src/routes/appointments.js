const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getPatientAppointments,
  cancelAppointment,
  deleteAppointment, // ← ADD THIS
  getBookedSlots
} = require('../controllers/appointmentController');

// POST /api/appointments - Create appointment
router.post('/', createAppointment);


router.get('/booked-slots', getBookedSlots);


// GET /api/appointments/patient/:patientId - Get patient appointments
router.get('/patient/:patientId', getPatientAppointments);


// PUT /api/appointments/:id/cancel - Cancel appointment
router.put('/:id/cancel', cancelAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', deleteAppointment);  // ← FIXED

module.exports = router;