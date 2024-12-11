import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../src/supabaseClient';

const SignUpPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Tutee');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const handleSignUp = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) {
        Alert.alert('Sign Up Error', signUpError.message);
        setIsLoading(false);
        return;
      }
  
      const userId = signUpData.user?.id;
      if (!userId) {
        Alert.alert('Error', 'User creation failed.');
        setIsLoading(false);
        return;
      }
  
      await supabase.auth.signOut();
  
      const { error: insertUserError } = await supabase.from('users').insert([{
        id: userId,
        full_name: fullName,
        role: role,
        email: email,
      }]);
  
      if (insertUserError) {
        Alert.alert('Database Error', insertUserError.message);
        setIsLoading(false);
        return;
      }
  
      if (role === 'Tutee') {
        const { error: insertTuteeError } = await supabase.from('tutees').insert([{
          user_id: userId,
        }]);
  
        if (insertTuteeError) {
          Alert.alert('Database Error', insertTuteeError.message);
          setIsLoading(false);
          return;
        }
      } else if (role === 'Tutor') {
        const { error: insertTutorError } = await supabase.from('tutors').insert([{
          user_id: userId,
        }]);
  
        if (insertTutorError) {
          Alert.alert('Database Error', insertTutorError.message);
          setIsLoading(false);
          return;
        }
      }
  
      Alert.alert('Success', 'Account created successfully! You can now log in.');
      setIsLoading(false); // Hide loading indicator
      navigation.navigate('Login'); // Redirect to login page
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#003366" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#808080"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>I am a:</Text>
      <RNPickerSelect
        onValueChange={(value) => setRole(value)}
        items={[
          { label: 'Tutee', value: 'Tutee' },
          { label: 'Tutor', value: 'Tutor' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select your role', value: null }}
        value={role}
      />

      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.loginButton}
      >
        Already have an account? Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003366',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#003366',
  },
  loginButton: {
    marginTop: 10,
    color: '#003366',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#003366',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#000',
  },
  inputAndroid: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#000',
  },
};

export default SignUpPage;
