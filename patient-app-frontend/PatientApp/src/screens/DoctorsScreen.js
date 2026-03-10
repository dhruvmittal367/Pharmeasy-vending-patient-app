import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import axios from 'axios';
import styles from '../styles/DoctorsStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function DoctorsScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`);
      setDoctors(response.data.doctors);
      setFilteredDoctors(response.data.doctors);
      setLoading(false);
    } catch (error) {
      console.error('Fetch doctors error:', error);
      Alert.alert('Error', 'Failed to load doctors');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor =>
        doctor.fullName.toLowerCase().includes(text.toLowerCase()) ||
        doctor.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const renderDoctor = ({ item }) => (
  <View style={styles.doctorCard}>
    <View style={styles.doctorHeader}>
      <View style={styles.doctorAvatar}>
        <Text style={styles.doctorAvatarText}>
          {item.first_name?.charAt(0)}{item.last_name?.charAt(0)}
        </Text>
      </View>
      
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.fullName}</Text>
        <Text style={styles.doctorSpecialty}>
          {item.specialization || 'General Physician'}
        </Text>
        <Text style={styles.doctorContact}>📧 {item.email}</Text>
        <Text style={styles.doctorContact}>📱 {item.mobile}</Text>
      </View>
    </View>

    {/* Buttons Row */}
    <View style={styles.doctorActions}>
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
      >
        <Text style={styles.detailsButtonText}>Show Details</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() => navigation.navigate('BookAppointment', { doctor: item })}
      >
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Doctors</Text>
        <Text style={styles.headerSubtitle}>{filteredDoctors.length} doctors available</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🩺</Text>
            <Text style={styles.emptyText}>No doctors found</Text>
          </View>
        }
      />
    </View>
  );
}