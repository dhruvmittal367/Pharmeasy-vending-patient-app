import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { authAPI } from '../services/api';
import { showSuccess, showError } from '../utils/toast';
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length !== 10) {
      newErrors.phone = 'Phone must be 10 digits';
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = 'Phone must contain only numbers';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        email: email.trim(),
        password,
        phone: phone.trim(),
        fullName: fullName.trim(),
        role: 'patient',
        // Patient data
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
      };

      await authAPI.signup(userData);
      
      showSuccess('Account created successfully!');
      
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1000);
      
    } catch (error) {
      console.error('Signup error:', error);
      showError(error.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.backButton}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up as a Patient</Text>

      {/* Required Fields */}
      <Text style={styles.sectionTitle}>Basic Information *</Text>
      
      <TextInput
        style={[styles.input, errors.fullName && styles.inputError]}
        placeholder="Full Name *"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          if (errors.fullName) setErrors({ ...errors, fullName: null });
        }}
        autoCapitalize="words"
        editable={!loading}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email *"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors({ ...errors, email: null });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={[styles.input, errors.phone && styles.inputError]}
        placeholder="Phone Number (10 digits) *"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          if (errors.phone) setErrors({ ...errors, phone: null });
        }}
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password (min 8 characters) *"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors({ ...errors, password: null });
        }}
        secureTextEntry
        editable={!loading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm Password *"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
        }}
        secureTextEntry
        editable={!loading}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {/* Optional Fields */}
      <Text style={styles.sectionTitle}>Additional Information (Optional)</Text>

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        editable={!loading}
      />

      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
          onPress={() => setGender('male')}
          disabled={loading}
        >
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
          onPress={() => setGender('female')}
          disabled={loading}
        >
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
            Female
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
          onPress={() => setGender('other')}
          disabled={loading}
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
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={setState}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        maxLength={6}
        editable={!loading}
      />

      <Text style={styles.sectionTitle}>Emergency Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Name"
        value={emergencyContactName}
        onChangeText={setEmergencyContactName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Phone"
        value={emergencyContactPhone}
        onChangeText={setEmergencyContactPhone}
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      <View style={{height: 40}} />
    </ScrollView>
  );
}