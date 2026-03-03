import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [user, setUser] = useState(null);

  const navigation = {
    navigate: (screen) => setCurrentScreen(screen),
    replace: (screen, params) => {
      console.log('App.js replace called with:', screen, params); // ← ADD THIS
      if (params?.user) {
        console.log('Setting user in App.js:', params.user); // ← ADD THIS
        setUser(params.user);
      }
      setCurrentScreen(screen);
    },
    setUser: (userData) => setUser(userData),
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('Login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'Signup':
        return <SignupScreen navigation={navigation} />;
      case 'Home':
        return <AppNavigator user={user} onLogout={handleLogout} />;
      default:
        return <LoginScreen navigation={navigation} />;
        
    }
  };

  return (
    <>
      {renderScreen()}
      <Toast /> 
    </>
  );
}