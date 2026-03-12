import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import PaymentScreen from '../screens/PaymentScreen'; // ← ADD THIS
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import styles from '../styles/AppNavigatorStyles';

export default function AppNavigator({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('Home');
  const [bookingDoctor, setBookingDoctor] = React.useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = React.useState(null);
  const [paymentData, setPaymentData] = React.useState(null); // ← ADD THIS

  const renderScreen = () => {
    const navigation = {
      navigate: (screen, params) => {
        if (screen === 'BookAppointment') {
          setBookingDoctor(params.doctor);
          setActiveTab('BookAppointment');
        } else if (screen === 'DoctorDetail') {
          setSelectedDoctorId(params.doctorId);
          setActiveTab('DoctorDetail');
        } else if (screen === 'Payment') { // ← ADD THIS
          setPaymentData(params);
          setActiveTab('Payment');
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
      case 'Payment': // ← ADD THIS
        return (
          <PaymentScreen 
            navigation={navigation} 
            appointmentData={paymentData?.appointmentData}
            doctor={paymentData?.doctor}
            user={user}
          />
        );
      case 'Appointments':
        return <AppointmentsScreen user={user} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} user={user} />;
      default:
        return <HomeScreen navigation={navigation} user={user} />;
    }
  };

  // Hide bottom tabs for BookAppointment, DoctorDetail, and Payment screens
  const showBottomTabs = activeTab !== 'BookAppointment' && activeTab !== 'DoctorDetail' && activeTab !== 'Payment';

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

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