import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';
import styles from '../styles/PaymentStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function PaymentScreen({ navigation, appointmentData, doctor, user }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    let appointmentId = null;
    
    try {
      // Step 1: Create appointment
      const appointmentResponse = await axios.post(`${API_URL}/appointments`, {
        patient_id: user.id,
        doctor_id: doctor.id,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        appointment_type: appointmentData.appointment_type,
        reason: appointmentData.reason,
        status: 'pending',
        payment_status: 'pending'
      });

      appointmentId = appointmentResponse.data.appointmentId;

      // Step 2: Create payment order
      const orderResponse = await axios.post(`${API_URL}/payments/create-order`, {
        appointment_id: appointmentId,
        patient_id: user.id,
        doctor_id: doctor.id,
        amount: doctor.consultation_fee || 500,
      });

      const { razorpay_order_id, amount, key_id } = orderResponse.data.order;

      // Step 3: Open Razorpay checkout
      const options = {
        description: `Consultation with Dr. ${doctor.fullName}`,
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: key_id,
        amount: amount,
        name: 'Patient App',
        order_id: razorpay_order_id,
        prefill: {
          email: user.email,
          contact: user.phone || '',
          name: user.fullName,
        },
        theme: { color: '#007AFF' },
      };

      const data = await RazorpayCheckout.open(options);

      // Step 4: Verify payment
      await verifyPayment(data, appointmentId);

    } catch (error) {
      console.error('Payment error:', error);
      
      // If appointment was created but payment failed, delete it
      if (appointmentId) {
        try {
          await axios.delete(`${API_URL}/appointments/${appointmentId}`);
          console.log('Deleted pending appointment');
        } catch (deleteError) {
          console.error('Failed to delete appointment:', deleteError);
        }
      }
      
      if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
        showError('Payment cancelled');
      } else {
        showError('Payment failed. Please use Skip Payment for testing.');
      }
      
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentData, appointmentId) => {
    try {
      await axios.post(`${API_URL}/payments/verify`, {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        appointment_id: appointmentId,
      });

      showSuccess('Payment successful! Appointment confirmed.');
      
      setTimeout(() => {
        navigation.navigate('Appointments');
      }, 1500);

    } catch (error) {
      console.error('Verification error:', error);
      showError('Payment verification failed');
      setLoading(false);
    }
  };

  const handleSkipPayment = async () => {
    setLoading(true);
    
    try {
      // Create appointment directly with confirmed status (test mode)
      await axios.post(`${API_URL}/appointments`, {
        patient_id: user.id,
        doctor_id: doctor.id,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        appointment_type: appointmentData.appointment_type,
        reason: appointmentData.reason,
        status: 'confirmed',
        payment_status: 'paid'
      });

      showSuccess('Appointment confirmed (Test Mode)!');
      
      setTimeout(() => {
        navigation.navigate('Appointments');
      }, 1500);

    } catch (error) {
      console.error('Skip payment error:', error);
      showError('Failed to confirm appointment');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Doctors')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.doctorCard}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>
              {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
            </Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {doctor.fullName}</Text>
            <Text style={styles.doctorSpecialty}>
              {doctor.specialization || 'General Physician'}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>
              {new Date(appointmentData.appointment_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{appointmentData.appointment_time}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type:</Text>
            <Text style={styles.summaryValue}>
              {appointmentData.appointment_type === 'video' && '📹 Video Call'}
              {appointmentData.appointment_type === 'audio' && '📞 Audio Call'}
              {appointmentData.appointment_type === 'chat' && '💬 Chat'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Consultation Fee:</Text>
            <Text style={styles.totalValue}>₹{doctor.consultation_fee || 500}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay ₹{doctor.consultation_fee || 500}</Text>
              <Text style={styles.payButtonSubtext}>Secure payment via Razorpay</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipPayment}
          disabled={loading}
        >
          <Text style={styles.skipButtonText}>Skip Payment (Test Mode)</Text>
        </TouchableOpacity>

        <View style={styles.paymentMethods}>
          <Text style={styles.methodsTitle}>Accepted Payment Methods</Text>
          <View style={styles.methodsIcons}>
            <Text style={styles.methodIcon}>💳</Text>
            <Text style={styles.methodIcon}>📱</Text>
            <Text style={styles.methodIcon}>🏦</Text>
            <Text style={styles.methodIcon}>💰</Text>
          </View>
          <Text style={styles.methodsText}>
            UPI • Cards • Net Banking • Wallets
          </Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}