import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import styles from '../styles/BookAppointmentStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function BookAppointmentScreen({ navigation, doctor, user }) {
  console.log('=== BookAppointment Screen ===');
  console.log('User:', user);
  console.log('Doctor:', doctor);
    
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patient_id: user.id,
        doctor_id: doctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason,
        status: 'pending'
      };

      await axios.post(`${API_URL}/appointments`, appointmentData);

      Alert.alert(
        'Success',
        'Appointment booked successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Appointments') }]
      );

    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Doctors')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      {/* Doctor Info Card */}
      <View style={styles.doctorCard}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.doctorAvatarText}>
            {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
          </Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.fullName}</Text>
          <Text style={styles.doctorSpecialty}>General Physician</Text>
          <Text style={styles.doctorContact}>📧 {doctor.email}</Text>
        </View>
      </View>

      {/* Appointment Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (e.g., 2026-02-28)"
          value={selectedDate}
          onChangeText={setSelectedDate}
        />

        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.timeSlotActive
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.timeSlotTextActive
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Reason for Visit</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your symptoms or reason for consultation..."
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}