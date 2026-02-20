import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { authAPI } from '../services/api';
import styles from '../styles/SignupStyles';

export default function SignupScreen({ navigation }) {
  // User table fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Patient table fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!email || !password || !phone || !fullName) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters with letters, numbers and special characters');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        email,
        password,
        phone,
        fullName: fullName,  // Changed from full_name
        role: 'patient',
        // Patient data
        dateOfBirth: dateOfBirth || null,  // Changed from date_of_birth
        gender: gender || null,
        bloodGroup: bloodGroup || null,  // Changed from blood_group
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        emergencyContactName: emergencyContactName || null,  // Changed from emergency_contact_name
        emergencyContactPhone: emergencyContactPhone || null,  // Changed from emergency_contact_phone
      };

      const response = await authAPI.signup(userData);
      
      Alert.alert(
        'Success', 
        'Account created successfully! Please login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up as a Patient</Text>

      {/* Required Fields */}
      <Text style={styles.sectionTitle}>Basic Information *</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number (10 digits) *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 8 characters) *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password *"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Optional Fields */}
      <Text style={styles.sectionTitle}>Additional Information (Optional)</Text>

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
          onPress={() => setGender('male')}
        >
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
          onPress={() => setGender('female')}
        >
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
            Female
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
          onPress={() => setGender('other')}
        >
          <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>
            Other
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Blood Group (e.g., A+, B-, O+)"
        value={bloodGroup}
        onChangeText={setBloodGroup}
        autoCapitalize="characters"
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={setState}
      />

      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        maxLength={6}
      />

      <Text style={styles.sectionTitle}>Emergency Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Name"
        value={emergencyContactName}
        onChangeText={setEmergencyContactName}
      />

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Phone"
        value={emergencyContactPhone}
        onChangeText={setEmergencyContactPhone}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      <View style={{height: 40}} />
    </ScrollView>
  );
} 