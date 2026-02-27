const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getPatientAppointments,
  cancelAppointment 
} = require('../controllers/appointmentController');

// POST /api/appointments - Create appointment
router.post('/', createAppointment);

// GET /api/appointments/patient/:patientId - Get patient appointments
router.get('/patient/:patientId', getPatientAppointments);

// PUT /api/appointments/:id/cancel - Cancel appointment
router.put('/:id/cancel', cancelAppointment);

module.exports = router;