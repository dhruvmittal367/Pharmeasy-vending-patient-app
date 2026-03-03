import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { showSuccess, showError } from '../utils/toast';
import { userAPI } from '../services/api';
import styles from '../styles/ProfileStyles';

export default function ProfileScreen({ navigation, user }) {
  const [editing, setEditing] = useState(false);
  
  // User fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Patient fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
  setLoading(true);
  try {
    const updateData = {
      fullName,
      phone,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      bloodGroup: bloodGroup || null,
      height: height || null,
      weight: weight || null,
      address: address || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      allergies: allergies || null,
      chronicDiseases: chronicDiseases || null,
      currentMedications: currentMedications || null,
    };

    await userAPI.updateProfile(user.id, updateData);
    
    showSuccess('Profile updated successfully');
    setEditing(false);
    
  } catch (error) {
    console.error('Update error:', error);
    showError(error.response?.data?.error || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>
            {fullName?.charAt(0) || 'U'}
          </Text>
        </View>
        
        <Text style={styles.headerName}>{fullName}</Text>
        <Text style={styles.headerEmail}>{email}</Text>
        
        {!editing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={fullName}
          onChangeText={setFullName}
          editable={editing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={editing}
        />

        <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="1995-01-15"
          editable={editing}
        />

        {/* Gender Selection */}
        {editing && (
          <>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
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
          </>
        )}

        {!editing && gender && (
          <>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.valueText}>{gender}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Health Information</Text>

        <Text style={styles.label}>Blood Group</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={bloodGroup}
          onChangeText={setBloodGroup}
          placeholder="A+, B-, O+, etc."
          editable={editing}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="170"
              editable={editing}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="70"
              editable={editing}
            />
          </View>
        </View>

        <Text style={styles.label}>Allergies</Text>
        <TextInput
          style={[styles.input, styles.textArea, !editing && styles.inputDisabled]}
          value={allergies}
          onChangeText={setAllergies}
          placeholder="List any allergies..."
          multiline
          numberOfLines={3}
          editable={editing}
        />

        <Text style={styles.label}>Chronic Diseases</Text>
        <TextInput
          style={[styles.input, styles.textArea, !editing && styles.inputDisabled]}
          value={chronicDiseases}
          onChangeText={setChronicDiseases}
          placeholder="List any chronic conditions..."
          multiline
          numberOfLines={3}
          editable={editing}
        />

        <Text style={styles.label}>Current Medications</Text>
        <TextInput
          style={[styles.input, styles.textArea, !editing && styles.inputDisabled]}
          value={currentMedications}
          onChangeText={setCurrentMedications}
          placeholder="List current medications..."
          multiline
          numberOfLines={3}
          editable={editing}
        />

        <Text style={styles.sectionTitle}>Address</Text>

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={address}
          onChangeText={setAddress}
          placeholder="Street address"
          editable={editing}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={city}
              onChangeText={setCity}
              editable={editing}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={state}
              onChangeText={setState}
              editable={editing}
            />
          </View>
        </View>

        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
          maxLength={6}
          editable={editing}
        />

        <Text style={styles.sectionTitle}>Emergency Contact</Text>

        <Text style={styles.label}>Emergency Contact Name</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={emergencyContactName}
          onChangeText={setEmergencyContactName}
          editable={editing}
        />

        <Text style={styles.label}>Emergency Contact Phone</Text>
        <TextInput
          style={[styles.input, !editing && styles.inputDisabled]}
          value={emergencyContactPhone}
          onChangeText={setEmergencyContactPhone}
          keyboardType="phone-pad"
          maxLength={10}
          editable={editing}
        />

        {editing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}