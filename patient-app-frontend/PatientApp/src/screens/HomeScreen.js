import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import styles from '../styles/HomeStyles';

export default function HomeScreen({ navigation, user }) {  // ← Change route to user

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

  return (
    <ScrollView style={styles.container}>
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

      {/* Dashboard Cards */}
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <View style={styles.cardsRow}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={styles.cardTitle}>Appointments</Text>
            <Text style={styles.cardSubtitle}>Book & View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
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

          <TouchableOpacity style={styles.card}
          onPress={() => navigation.navigate('Profile')} >
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.cardSubtitle}>Edit details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📭</Text>
          <Text style={styles.emptyStateText}>No recent activity</Text>
          <Text style={styles.emptyStateSubtext}>
            Book your first appointment to get started
          </Text>
        </View>
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}