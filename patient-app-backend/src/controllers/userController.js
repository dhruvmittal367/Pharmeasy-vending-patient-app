const db = require('../config/db');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      'SELECT id, email, full_name, phone, role, profile_image FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get patient details
    const [patients] = await db.query(
      'SELECT * FROM patients WHERE user_id = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      user: users[0],
      patient: patients.length > 0 ? patients[0] : null
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      fullName,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      address,
      city,
      state,
      pincode,
      emergencyContactName,
      emergencyContactPhone,
      allergies,
      chronicDiseases,
      currentMedications
    } = req.body;

    // Update users table
    await db.query(
      'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
      [fullName, phone, userId]
    );

    // Check if patient record exists
    const [existingPatient] = await db.query(
      'SELECT id FROM patients WHERE user_id = ?',
      [userId]
    );

    if (existingPatient.length > 0) {
      // Update existing patient record
      await db.query(
        `UPDATE patients SET 
          date_of_birth = ?,
          gender = ?,
          blood_group = ?,
          height = ?,
          weight = ?,
          address = ?,
          city = ?,
          state = ?,
          pincode = ?,
          emergency_contact_name = ?,
          emergency_contact_phone = ?,
          allergies = ?,
          chronic_diseases = ?,
          current_medications = ?
        WHERE user_id = ?`,
        [
          dateOfBirth, gender, bloodGroup, height, weight,
          address, city, state, pincode,
          emergencyContactName, emergencyContactPhone,
          allergies, chronicDiseases, currentMedications,
          userId
        ]
      );
    } else {
      // Insert new patient record
      await db.query(
        `INSERT INTO patients 
          (user_id, date_of_birth, gender, blood_group, height, weight, 
           address, city, state, pincode, emergency_contact_name, 
           emergency_contact_phone, allergies, chronic_diseases, current_medications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, dateOfBirth, gender, bloodGroup, height, weight,
          address, city, state, pincode,
          emergencyContactName, emergencyContactPhone,
          allergies, chronicDiseases, currentMedications
        ]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};