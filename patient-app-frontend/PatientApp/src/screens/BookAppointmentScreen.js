import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { showSuccess, showError } from '../utils/toast';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import styles from '../styles/BookAppointmentStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function BookAppointmentScreen({ navigation, doctor, user }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationMode, setConsultationMode] = useState('video');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const eveningSlots = ['17:00', '17:30', '18:00', '18:30'];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      showError('Please select date, time and enter reason');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patient_id: user.id,
        doctor_id: doctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        appointment_type: consultationMode,
        reason: reason.trim(),
        status: 'pending'
      };

      await axios.post(`${API_URL}/appointments`, appointmentData);

      showSuccess('Appointment booked successfully!');
      
      setTimeout(() => {
        navigation.navigate('Appointments');
      }, 1000);

    } catch (error) {
      console.error('Booking error:', error);
      showError(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const renderTimeSlot = (time) => (
    <TouchableOpacity
      key={time}
      style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
      onPress={() => setSelectedTime(time)}
    >
      <Text style={[styles.timeSlotText, selectedTime === time && styles.timeSlotTextActive]}>
        {time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Doctors')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

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

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            minDate={today}
            maxDate={maxDateStr}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#007AFF',
                selectedTextColor: '#fff'
              }
            }}
            theme={{
              todayTextColor: '#007AFF',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#fff',
              arrowColor: '#007AFF',
              monthTextColor: '#333',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
            }}
          />
        </View>

        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateLabel}>Selected Date:</Text>
            <Text style={styles.selectedDateText}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        )}

        {selectedDate && (
          <>
            <Text style={styles.sectionTitle}>Select Consultation Mode</Text>
            <View style={styles.consultationModeContainer}>
              <TouchableOpacity
                style={[styles.modeButton, consultationMode === 'video' && styles.modeButtonActive]}
                onPress={() => setConsultationMode('video')}
              >
                <Text style={styles.modeIcon}>📹</Text>
                <Text style={[styles.modeText, consultationMode === 'video' && styles.modeTextActive]}>
                  Video Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, consultationMode === 'audio' && styles.modeButtonActive]}
                onPress={() => setConsultationMode('audio')}
              >
                <Text style={styles.modeIcon}>📞</Text>
                <Text style={[styles.modeText, consultationMode === 'audio' && styles.modeTextActive]}>
                  Audio Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, consultationMode === 'chat' && styles.modeButtonActive]}
                onPress={() => setConsultationMode('chat')}
              >
                <Text style={styles.modeIcon}>💬</Text>
                <Text style={[styles.modeText, consultationMode === 'chat' && styles.modeTextActive]}>
                  Chat
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Select Time Slot</Text>
            
            <Text style={styles.slotGroupTitle}>Morning</Text>
            <View style={styles.timeSlotsContainer}>
              {morningSlots.map(renderTimeSlot)}
            </View>

            <Text style={styles.slotGroupTitle}>Afternoon</Text>
            <View style={styles.timeSlotsContainer}>
              {afternoonSlots.map(renderTimeSlot)}
            </View>

            <Text style={styles.slotGroupTitle}>Evening</Text>
            <View style={styles.timeSlotsContainer}>
              {eveningSlots.map(renderTimeSlot)}
            </View>
          </>
        )}

        {selectedDate && selectedTime && (
          <>
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
          </>
        )}

        {!selectedDate && (
          <View style={styles.instructionBox}>
            <Text style={styles.instructionIcon}>📅</Text>
            <Text style={styles.instructionText}>
              Please select a date from the calendar above to view available time slots
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}