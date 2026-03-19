import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const eveningSlots = ['17:00', '17:30', '18:00', '18:30'];

  // Fetch booked slots when date is selected
  useEffect(() => {
    if (selectedDate && doctor.id) {
      fetchBookedSlots();
    }
  }, [selectedDate, doctor.id]);

  const fetchBookedSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await axios.get(`${API_URL}/appointments/booked-slots`, {
        params: {
          doctorId: doctor.id,
          date: selectedDate
        }
      });

      setBookedSlots(response.data.bookedSlots || []);
    } catch (error) {
      console.error('Fetch booked slots error:', error);
      // Don't show error to user, just set empty array
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      showError('Please select date, time and enter reason');
      return;
    }

    // Check if slot is booked (extra validation)
    if (bookedSlots.includes(selectedTime)) {
      showError('This slot is already booked. Please select another time.');
      return;
    }

    navigation.navigate('Payment', {
      appointmentData: {
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        appointment_type: consultationMode,
        reason: reason.trim(),
      },
      doctor: doctor,
      user: user,
    });
  };

  const isSlotBooked = (time) => {
    return bookedSlots.includes(time);
  };

  const renderTimeSlot = (time) => {
    const booked = isSlotBooked(time);
    
    return (
      <TouchableOpacity
        key={time}
        style={[
          styles.timeSlot,
          selectedTime === time && styles.timeSlotActive,
          booked && styles.timeSlotBooked
        ]}
        onPress={() => !booked && setSelectedTime(time)}
        disabled={booked}
      >
        <Text style={[
          styles.timeSlotText,
          selectedTime === time && styles.timeSlotTextActive,
          booked && styles.timeSlotTextBooked
        ]}>
          {time}
        </Text>
        {booked && (
          <Text style={styles.bookedBadge}>Booked</Text>
        )}
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.doctorSpecialty}>
            {doctor.specialization || 'General Physician'}
          </Text>
          <Text style={styles.doctorContact}>📧 {doctor.email}</Text>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            minDate={today}
            maxDate={maxDateStr}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedTime(''); // Reset selected time when date changes
            }}
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

            {loadingSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading available slots...</Text>
              </View>
            ) : (
              <>
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
              onPress={handleProceedToPayment}
            >
              <Text style={styles.bookButtonText}>Proceed to Payment</Text>
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