import React from 'react';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import styles from '../styles/AppNavigatorStyles';
import BookAppointmentScreen from '../screens/BookAppointmentScreen'; 
import AppointmentsScreen from '../screens/AppointmentsScreen'; 


export default function AppNavigator({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('Home');
   const [bookingDoctor, setBookingDoctor] = React.useState(null);

  const renderScreen = () => {
    const navigation = {
      navigate: (screen, params) => {  
        if (screen === 'BookAppointment') {
          setBookingDoctor(params.doctor);
          setActiveTab('BookAppointment');
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

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabButton
          icon="🏠"
          label="Home"
          active={activeTab === 'Home'}
          onPress={() => setActiveTab('Home')}
        />
        <TabButton
          icon="👨‍⚕️"
          label="Doctors"
          active={activeTab === 'Doctors'}
          onPress={() => setActiveTab('Doctors')}
        />
        <TabButton
          icon="📅"
          label="Appointments"
          active={activeTab === 'Appointments'}
          onPress={() => setActiveTab('Appointments')}
        />
        <TabButton
          icon="👤"
          label="Profile"
          active={activeTab === 'Profile'}
          onPress={() => setActiveTab('Profile')}
        />
      </View>
    </View>
  );
}

function TabButton({ icon, label, active, onPress }) {
  return (
    <View style={styles.tabButton} onPress={onPress}>
      <Text 
        style={[styles.tabIcon, active && styles.tabIconActive]}
        onPress={onPress}
      >
        {icon}
      </Text>
      <Text 
        style={[styles.tabLabel, active && styles.tabLabelActive]}
        onPress={onPress}
      >
        {label}
      </Text>
    </View>
  );
}