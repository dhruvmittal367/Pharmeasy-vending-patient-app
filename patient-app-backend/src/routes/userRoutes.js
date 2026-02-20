const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const pool = require('../config/db');

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.created_at,
              p.date_of_birth, p.blood_group, p.gender, p.address
       FROM users u
       LEFT JOIN patients p ON u.id = p.user_id
       WHERE u.id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;