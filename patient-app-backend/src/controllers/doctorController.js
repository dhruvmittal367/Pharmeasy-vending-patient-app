const adminDb = require('../config/adminDb');

// Get all doctors with their complete details from doctors table
exports.getAllDoctors = async (req, res) => {
  try {
    // JOIN users and doctors tables to get complete info
    const [doctors] = await adminDb.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.mobile,
        CONCAT(u.first_name, ' ', u.last_name) as fullName,
        u.role,
        u.active as isActive,
        d.user_id,
        d.specialization,
        d.qualification,
        d.experience_years,
        d.registration_number,
        d.registration_council,
        d.registration_year,
        d.bio,
        d.consultation_fee,
        d.is_verified,
        d.verification_status,
        d.rating,
        d.total_reviews,
        d.total_consultations,
        d.languages_spoken,
        d.awards
      FROM users u
      LEFT JOIN doctors d ON u.id = d.user_id
      WHERE u.role = 'DOCTOR' AND u.active = 1
      ORDER BY u.first_name ASC
    `);

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctors'
    });
  }
};

// Get single doctor by ID with complete details
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [doctors] = await adminDb.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.mobile,
        CONCAT(u.first_name, ' ', u.last_name) as fullName,
        u.role,
        u.active as isActive,
        d.user_id,
        d.specialization,
        d.qualification,
        d.experience_years,
        d.registration_number,
        d.registration_council,
        d.registration_year,
        d.bio,
        d.consultation_fee,
        d.is_verified,
        d.verification_status,
        d.rating,
        d.total_reviews,
        d.total_consultations,
        d.languages_spoken,
        d.awards
      FROM users u
      LEFT JOIN doctors d ON u.id = d.user_id
      WHERE u.id = ? AND u.role = 'DOCTOR'
    `, [id]);

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      doctor: doctors[0]
    });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor'
    });
  }
};
