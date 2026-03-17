const express = require('express');
const cors = require('cors');
const http = require('http');              // ← ADD
const { Server } = require('socket.io');  // ← ADD
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const doctorRoutes = require('./src/routes/doctors');
const appointmentRoutes = require('./src/routes/appointments'); 
const paymentRoutes = require('./src/routes/payments');
const appointmentController = require('./src/controllers/appointmentController'); // ← ADD
const db = require('./src/config/db'); // ← ADD (already hoga, path check karo)

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // React ports
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
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

// ─────────────────────────────────────────
// ⚡ SOCKET.IO SETUP
// ─────────────────────────────────────────
const server = http.createServer(app);  // ← app se server banao

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

// io instance appointmentController ko do
appointmentController.setIo(io);

io.on("connection", (socket) => {
  console.log("✅ Doctor connected via socket:", socket.id);

  // Doctor apne room mein join kare
  socket.on("join_doctor_room", async (doctorId) => {
    socket.join(`doctor_${doctorId}`);
    console.log(`👨‍⚕️ Doctor ${doctorId} joined their room`);

    // Turant us doctor ki appointments bhejo
    try {
      const [appointments] = await db.query(
        `SELECT * FROM appointments 
         WHERE doctor_id = ? 
         ORDER BY appointment_date ASC`,
        [doctorId]
      );
      socket.emit("appointments_update", appointments);
    } catch (err) {
      console.error("Error fetching appointments for doctor:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Doctor disconnected:", socket.id);
  });
});

// ─────────────────────────────────────────
// 🚀 app.listen → server.listen
// ─────────────────────────────────────────
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {  // ← app.listen ki jagah server.listen
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket ready on ws://localhost:${PORT}`);
});