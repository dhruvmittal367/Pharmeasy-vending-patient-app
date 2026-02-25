const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');

// GET /api/doctors - Get all doctors
router.get('/', getAllDoctors);

// GET /api/doctors/:id - Get single doctor
router.get('/:id', getDoctorById);

module.exports = router;