import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { showError } from '../utils/toast';
import styles from '../styles/DoctorDetailStyles';

const API_URL = 'http://10.0.2.2:8080/api';

export default function DoctorDetailScreen({ navigation, doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors/${doctorId}`);
      console.log('Doctor details:', response.data.doctor);
      setDoctor(response.data.doctor);
      setLoading(false);
    } catch (error) {
      console.error('Fetch doctor details error:', error);
      showError('Failed to load doctor details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Doctor not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Doctors')}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Doctors')}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
      </View>

      {/* Doctor Info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
          </Text>
        </View>
        <Text style={styles.doctorName}>{doctor.fullName}</Text>
        <Text style={styles.specialization}>
          {doctor.specialization || 'General Physician'}
        </Text>
        
        {(doctor.rating !== null && doctor.rating !== undefined && doctor.rating > 0) && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {doctor.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>
              ({doctor.total_reviews || 0} reviews)
            </Text>
          </View>
        )}

        {(doctor.total_consultations !== null && doctor.total_consultations !== undefined && doctor.total_consultations > 0) && (
          <Text style={styles.consultationsText}>
            {doctor.total_consultations} consultations completed
          </Text>
        )}
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{doctor.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{doctor.mobile}</Text>
        </View>
      </View>

      {/* Qualification */}
      {doctor.qualification && doctor.qualification.trim() !== '' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualification</Text>
          <Text style={styles.value}>{doctor.qualification}</Text>
        </View>
      )}

      {/* Experience */}
      {(doctor.experience_years !== null && doctor.experience_years !== undefined) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.value}>
            {doctor.experience_years} {doctor.experience_years === 1 ? 'year' : 'years'}
          </Text>
        </View>
      )}

      {/* Consultation Fee */}
      {(doctor.consultation_fee !== null && doctor.consultation_fee !== undefined) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultation Fee</Text>
          <Text style={styles.feeText}>₹{doctor.consultation_fee}</Text>
        </View>
      )}

      {/* Languages Spoken */}
      {doctor.languages_spoken && doctor.languages_spoken.trim() !== '' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages Spoken</Text>
          <Text style={styles.value}>{doctor.languages_spoken}</Text>
        </View>
      )}

      {/* About/Bio */}
      {doctor.bio && doctor.bio.trim() !== '' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{doctor.bio}</Text>
        </View>
      )}

      {/* Registration Details */}
      {(doctor.registration_number || doctor.registration_council || doctor.registration_year) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration Details</Text>
          
          {doctor.registration_number && doctor.registration_number.trim() !== '' && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Registration No:</Text>
              <Text style={styles.value}>{doctor.registration_number}</Text>
            </View>
          )}
          
          {doctor.registration_council && doctor.registration_council.trim() !== '' && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Council:</Text>
              <Text style={styles.value}>{doctor.registration_council}</Text>
            </View>
          )}
          
          {(doctor.registration_year !== null && doctor.registration_year !== undefined) && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Year:</Text>
              <Text style={styles.value}>{doctor.registration_year}</Text>
            </View>
          )}
        </View>
      )}

      {/* Awards */}
      {doctor.awards && doctor.awards.trim() !== '' && doctor.awards.toLowerCase() !== 'null' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Awards & Recognition</Text>
          <Text style={styles.value}>{doctor.awards}</Text>
        </View>
      )}

      {/* Verification Status */}
      {doctor.is_verified === 1 && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedIcon}>✓</Text>
          <Text style={styles.verifiedText}>Verified Doctor</Text>
        </View>
      )}

      {/* Book Appointment Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('BookAppointment', { doctor })}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}