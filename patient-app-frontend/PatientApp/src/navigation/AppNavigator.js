import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Temporary placeholder screens
function DoctorsScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>👨‍⚕️</Text>
      <Text style={styles.placeholderTitle}>Doctors</Text>
      <Text style={styles.placeholderSubtitle}>Coming soon...</Text>
    </View>
  );
}

function AppointmentsScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>📅</Text>
      <Text style={styles.placeholderTitle}>Appointments</Text>
      <Text style={styles.placeholderSubtitle}>Coming soon...</Text>
    </View>
  );
}

export default function AppNavigator({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('Home');

  const renderScreen = () => {
    const navigation = {
      navigate: (screen) => setActiveTab(screen),
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
        return <DoctorsScreen />;
      case 'Appointments':
        return <AppointmentsScreen />;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 5,
    paddingTop: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    fontSize: 80,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});