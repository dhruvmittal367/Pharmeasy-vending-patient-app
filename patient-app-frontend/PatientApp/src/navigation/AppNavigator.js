import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import styles from '../styles/AppNavigatorStyles';

export default function AppNavigator({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('Home');
  const [bookingDoctor, setBookingDoctor] = React.useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = React.useState(null);

  const renderScreen = () => {
    const navigation = {
      navigate: (screen, params) => {
        if (screen === 'BookAppointment') {
          setBookingDoctor(params.doctor);
          setActiveTab('BookAppointment');
        } else if (screen === 'DoctorDetail') {
          setSelectedDoctorId(params.doctorId);
          setActiveTab('DoctorDetail');
        } else {
          setActiveTab(screen);
        }
      },
      replace: (screen) => {
        if (screen === 'Login') {
          onLogout();
        } else {
          setActiveTab(screen);
        }
      },
    };

    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} user={user} />;
      case 'Doctors':
        return <DoctorsScreen navigation={navigation} />;
      case 'DoctorDetail':
        return <DoctorDetailScreen navigation={navigation} doctorId={selectedDoctorId} />;
      case 'BookAppointment':
        return <BookAppointmentScreen navigation={navigation} doctor={bookingDoctor} user={user} />;
      case 'Appointments':
        return <AppointmentsScreen user={user} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} user={user} />;
      default:
        return <HomeScreen navigation={navigation} user={user} />;
    }
  };

  // Hide bottom tabs for BookAppointment and DoctorDetail screens
  const showBottomTabs = activeTab !== 'BookAppointment' && activeTab !== 'DoctorDetail';

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      {showBottomTabs && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={[styles.tabLabel, activeTab === 'Home' && styles.tabLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Doctors')}
          >
            <Text style={styles.tabIcon}>👨‍⚕️</Text>
            <Text style={[styles.tabLabel, activeTab === 'Doctors' && styles.tabLabelActive]}>
              Doctors
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Appointments')}
          >
            <Text style={styles.tabIcon}>📅</Text>
            <Text style={[styles.tabLabel, activeTab === 'Appointments' && styles.tabLabelActive]}>
              Appointments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Profile')}
          >
            <Text style={styles.tabIcon}>👤</Text>
            <Text style={[styles.tabLabel, activeTab === 'Profile' && styles.tabLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}