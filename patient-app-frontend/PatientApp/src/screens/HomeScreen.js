import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import styles from '../styles/HomeStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function HomeScreen({ navigation, user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/patient/${user.id}`);
      setAppointments(response.data.appointments);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Fetch appointments error:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => navigation.replace('Login'),
          style: 'destructive'
        }
      ]
    );
  };
  

const today = new Date();
today.setHours(0, 0, 0, 0); 

const upcomingAppointments = appointments.filter(apt => {
  const appointmentDate = new Date(apt.appointment_date);
  appointmentDate.setHours(0, 0, 0, 0);
  return (
    appointmentDate >= today && 
    apt.status !== 'cancelled' && 
    apt.status !== 'completed'
  );
});

const todayAppointments = appointments.filter(apt => {
  const appointmentDate = new Date(apt.appointment_date);
  appointmentDate.setHours(0, 0, 0, 0);
  return (
    appointmentDate.getTime() === today.getTime() &&
    apt.status !== 'cancelled' &&
    apt.status !== 'completed'
  );
});

// Get next appointment (earliest upcoming)
const nextAppointment = upcomingAppointments.length > 0
  ? upcomingAppointments
      .sort((a, b) => {
        const dateA = new Date(a.appointment_date + ' ' + a.appointment_time);
        const dateB = new Date(b.appointment_date + ' ' + b.appointment_time);
        return dateA - dateB;
      })[0]
  : null;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with user info */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{appointments.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{upcomingAppointments.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todayAppointments.length}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>

      {/* Next Appointment Widget */}
      {nextAppointment && (
        <View style={styles.nextAppointmentSection}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          <View style={styles.nextAppointmentCard}>
            <View style={styles.appointmentDateBadge}>
              <Text style={styles.appointmentDay}>
                {new Date(nextAppointment.appointment_date).getDate()}
              </Text>
              <Text style={styles.appointmentMonth}>
                {new Date(nextAppointment.appointment_date).toLocaleString('default', { month: 'short' })}
              </Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentDoctor}>
                Dr. {nextAppointment.doctor_name}
              </Text>
              <Text style={styles.appointmentTime}>
                🕐 {nextAppointment.appointment_time}
              </Text>
              <Text style={styles.appointmentReason} numberOfLines={1}>
                {nextAppointment.reason}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <View style={styles.cardsRow}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Appointments')}
          >
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={styles.cardTitle}>Appointments</Text>
            <Text style={styles.cardSubtitle}>Book & View</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Doctors')}
          >
            <Text style={styles.cardIcon}>👨‍⚕️</Text>
            <Text style={styles.cardTitle}>Find Doctors</Text>
            <Text style={styles.cardSubtitle}>Search specialists</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsRow}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardTitle}>Medical Records</Text>
            <Text style={styles.cardSubtitle}>View history</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>💊</Text>
            <Text style={styles.cardTitle}>Prescriptions</Text>
            <Text style={styles.cardSubtitle}>View & Download</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Stay Hydrated</Text>
            <Text style={styles.tipText}>
              Drink at least 8 glasses of water daily for better health
            </Text>
          </View>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🏃</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Regular Exercise</Text>
            <Text style={styles.tipText}>
              30 minutes of exercise daily keeps you fit and healthy
            </Text>
          </View>
        </View>
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}