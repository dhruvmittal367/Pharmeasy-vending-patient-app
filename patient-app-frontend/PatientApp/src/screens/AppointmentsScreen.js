import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { showSuccess, showError } from '../utils/toast';
import axios from 'axios';

import styles from '../styles/AppointmentsStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function AppointmentsScreen({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

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
      Alert.alert('Error', 'Failed to load appointments');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
  Alert.alert(
    'Cancel Appointment',
    'Are you sure you want to cancel this appointment?',
    [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.put(`${API_URL}/appointments/${appointmentId}/cancel`);
            showSuccess('Appointment cancelled successfully');
            fetchAppointments();
          } catch (error) {
            showError('Failed to cancel appointment');
          }
        }
      }
    ]
  );
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'completed': return '#007AFF';
      case 'cancelled': return '#dc3545';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'completed': return '✔️';
      case 'cancelled': return '❌';
      default: return '📅';
    }
  };

  const renderAppointment = ({ item }) => {
    const isPast = new Date(item.appointment_date) < new Date();
    const canCancel = item.status === 'pending' || item.status === 'confirmed';

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateDay}>
              {new Date(item.appointment_date).getDate()}
            </Text>
            <Text style={styles.dateMonth}>
              {new Date(item.appointment_date).toLocaleString('default', { month: 'short' })}
            </Text>
          </View>

          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>Dr. {item.doctor_name || 'Unknown'}</Text>
            <Text style={styles.appointmentTime}>🕐 {item.appointment_time}</Text>
            <Text style={styles.appointmentReason} numberOfLines={1}>
              {item.reason}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {canCancel && !isPast && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelAppointment(item.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <Text style={styles.headerSubtitle}>{appointments.length} total</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.filterTabActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'past' && styles.filterTabActive]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No appointments yet</Text>
            <Text style={styles.emptySubtext}>Book your first appointment with a doctor</Text>
          </View>
        }
      />
    </View>
  );
}