import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; // Using components from react-native-paper
import { Ionicons } from '@expo/vector-icons'; // For back arrow icon
import supabase from '../src/supabaseClient'; // Import Supabase client

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState(''); // State to store email input
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

  // Handle password reset request
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Use Supabase to send a password reset email
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);

      if (error) {
        Alert.alert('Error', error.message);
        setIsLoading(false);
        return;
      }

      // Inform user of successful request
      Alert.alert('Success', 'Password reset email has been sent');
      navigation.navigate('Login'); // Redirect to login page after successful request
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow Icon */}
      <Ionicons
        name="arrow-back"
        size={30}
        color="#003366"
        style={styles.backIcon}
        onPress={() => navigation.goBack()} // Navigate back on press
      />

      <Text style={styles.title}>Forgot Password</Text>

      {/* Email input */}
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        mode="outlined"
      />

      {/* Reset password button */}
      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
        loading={isLoading} // Show loading spinner while waiting
        disabled={isLoading} // Disable button while loading
      >
        Reset Password
      </Button>

      {/* Back to login button */}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Back to Login
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
    marginTop:20
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003366',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    width: '100%',
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#003366',
  },
  backButton: {
    color: '#003366',
  },
});

export default ForgotPassword;
