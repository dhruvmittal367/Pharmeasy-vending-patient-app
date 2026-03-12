const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    const { appointment_id, patient_id, doctor_id, amount } = req.body;

    // Validation
    if (!appointment_id || !patient_id || !doctor_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      receipt: `receipt_${appointment_id}_${Date.now()}`,
      notes: {
        appointment_id,
        patient_id,
        doctor_id,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order to database
    const [result] = await db.query(
      `INSERT INTO payment_orders 
       (appointment_id, patient_id, doctor_id, amount, currency, razorpay_order_id, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [appointment_id, patient_id, doctor_id, amount, 'INR', razorpayOrder.id, 'pending']
    );

    res.status(201).json({
      success: true,
      order: {
        id: result.insertId,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID, // Send to frontend
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      appointment_id 
    } = req.body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment details',
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // Update payment order status
      await db.query(
        `UPDATE payment_orders 
         SET razorpay_payment_id = ?, 
             razorpay_signature = ?, 
             payment_status = 'paid',
             updated_at = NOW()
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      // Update appointment payment status
      await db.query(
        `UPDATE appointments 
         SET payment_status = 'paid', 
             status = 'confirmed'
         WHERE id = ?`,
        [appointment_id]
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      // Payment verification failed
      await db.query(
        `UPDATE payment_orders 
         SET payment_status = 'failed',
             updated_at = NOW()
         WHERE razorpay_order_id = ?`,
        [razorpay_order_id]
      );

      res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
    });
  }
};

// Get payment details
exports.getPaymentByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const [payments] = await db.query(
      `SELECT * FROM payment_orders WHERE appointment_id = ?`,
      [appointmentId]
    );

    res.status(200).json({
      success: true,
      payment: payments[0] || null,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment details',
    });
  }
};