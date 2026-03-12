const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const doctorRoutes = require('./src/routes/doctors');
const appointmentRoutes = require('./src/routes/appointments'); 
const paymentRoutes = require('./src/routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes); 
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Patient App API is running!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});