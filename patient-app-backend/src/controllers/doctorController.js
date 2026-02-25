const adminDb = require('../config/adminDb');

// Get all doctors from admin_db
exports.getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await adminDb.query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        mobile,
        CONCAT(first_name, ' ', last_name) as fullName,
        role,
        active as isActive
      FROM users 
      WHERE role = 'DOCTOR' AND active = 1
      ORDER BY first_name ASC
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

// Get single doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [doctors] = await adminDb.query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        mobile,
        CONCAT(first_name, ' ', last_name) as fullName,
        role,
        active as isActive
      FROM users 
      WHERE id = ? AND role = 'DOCTOR'
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