const mysql = require('mysql2/promise');
require('dotenv').config();

// Admin DB connection pool
const adminDbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'admin_db',  // Admin database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
adminDbPool.getConnection()
  .then(connection => {
    console.log('✅ Admin DB connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Admin DB connection failed:', err.message);
  });

module.exports = adminDbPool;