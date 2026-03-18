const db = require('../config/db');
const adminDb = require('../config/adminDb');

// ─────────────────────────────────────────
// ⚡ Socket.io setup
// ─────────────────────────────────────────
let io;
exports.setIo = (socketIo) => {
  io = socketIo;
};

// Helper: Doctor ke appointments fetch karo
const getDoctorAppointments = async (doctorId) => {
  const [rows] = await db.query(
    `SELECT 
      a.*,
      u.full_name AS patient_name,
      u.email AS patient_email,
      u.phone AS patient_phone
     FROM appointments a
     LEFT JOIN users u ON a.patient_id = u.id
     WHERE a.doctor_id = ?
     ORDER BY a.appointment_date ASC`,
    [doctorId]
  );
  console.log("🔍 Sample row:", rows[0]);
  return rows;
};


// Helper: Doctor ko real-time update bhejo
const emitToDoctor = async (doctorId) => {
  if (!io || !doctorId) return;
  const appointments = await getDoctorAppointments(doctorId);
  io.to(`doctor_${doctorId}`).emit("appointments_update", appointments);
};

// ─────────────────────────────────────────
// Create new appointment
// ─────────────────────────────────────────
exports.createAppointment = async (req, res) => {
  try {
    const { 
      patient_id, 
      doctor_id, 
      appointment_date, 
      appointment_time, 
      appointment_type,
      reason,
      status,
      payment_status
    } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !reason) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const [result] = await db.query(
      `INSERT INTO appointments 
       (patient_id, doctor_id, appointment_date, appointment_time, appointment_type, reason, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id, 
        doctor_id, 
        appointment_date, 
        appointment_time, 
        appointment_type || 'video', 
        reason,
        status || 'pending',
        payment_status || 'pending'
      ]
    );

    // ⚡ Real-time update
    await emitToDoctor(doctor_id);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointmentId: result.insertId
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment'
    });
  }
};

// ─────────────────────────────────────────
// Get all appointments for a patient
// ─────────────────────────────────────────
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    const [appointments] = await db.query(
      `SELECT * FROM appointments 
       WHERE patient_id = ?
       ORDER BY appointment_date DESC, appointment_time DESC`,
      [patientId]
    );

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

// ─────────────────────────────────────────
// Cancel appointment
// ─────────────────────────────────────────
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Pehle doctor_id nikalo
    const [rows] = await db.query(
      'SELECT doctor_id FROM appointments WHERE id = ?', [id]
    );
    const doctor_id = rows[0]?.doctor_id;

    await db.query(
      'UPDATE appointments SET status = ?, cancelled_at = NOW(), cancelled_by = ? WHERE id = ?',
      ['cancelled', 'patient', id]
    );

    // ⚡ Real-time update
    await emitToDoctor(doctor_id);

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

// ─────────────────────────────────────────
// Delete appointment
// ─────────────────────────────────────────
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Pehle doctor_id nikalo
    const [rows] = await db.query(
      'SELECT doctor_id FROM appointments WHERE id = ?', [id]
    );
    const doctor_id = rows[0]?.doctor_id;

    await db.query('DELETE FROM payment_orders WHERE appointment_id = ?', [id]);
    await db.query('DELETE FROM appointments WHERE id = ?', [id]);

    // ⚡ Real-time update
    await emitToDoctor(doctor_id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete appointment'
    });
  }
};
exports.getDoctorAppointments = getDoctorAppointments;