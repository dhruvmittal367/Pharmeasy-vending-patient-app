const db = require('../config/db');
const adminDb = require('../config/adminDb');

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason } = req.body;

    // Validation
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !reason) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Insert appointment
    const [result] = await db.query(
      `INSERT INTO appointments 
       (patient_id, doctor_id, appointment_date, appointment_time, reason, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [patient_id, doctor_id, appointment_date, appointment_time, reason]
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointmentId: result.insertId
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book appointment'
    });
  }
};

// Get all appointments for a patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get appointments from patient_app database
    const [appointments] = await db.query(
      `SELECT * FROM appointments 
       WHERE patient_id = ?
       ORDER BY appointment_date DESC, appointment_time DESC`,
      [patientId]
    );

    // Get doctor details from admin_db for each appointment
    for (let appointment of appointments) {
      try {
        const [doctors] = await adminDb.query(
          `SELECT id, email, first_name, last_name, 
           CONCAT(first_name, ' ', last_name) as full_name
           FROM users 
           WHERE id = ? AND role = 'DOCTOR'`,
          [appointment.doctor_id]
        );
        
        if (doctors.length > 0) {
          appointment.doctor_name = doctors[0].full_name;
          appointment.doctor_email = doctors[0].email;
        } else {
          appointment.doctor_name = 'Unknown Doctor';
          appointment.doctor_email = '';
        }
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        appointment.doctor_name = 'Unknown Doctor';
        appointment.doctor_email = '';
      }
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments'
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', id]
    );

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel appointment'
    });
  }
};